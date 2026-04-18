import { IPaymentService, PaymentResult, WithdrawalResult } from './payment.interface';
import { transactionRepository } from '../../repositories/transaction.repository';
import { walletRepository } from '../../repositories/wallet.repository';
import { consultationRepository } from '../../repositories/consultation.repository';
import { TransactionType, TransactionStatus, TransactionMode, EscrowState, ConsultationStatus } from '@prisma/client';
import { logger } from '../../utils/logger';

const COMMISSION_RATE_RAW = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.10');
const COMMISSION_RATE = (() => {
  if (COMMISSION_RATE_RAW >= 0 && COMMISSION_RATE_RAW <= 1) return COMMISSION_RATE_RAW;
  logger.warn(`Invalid PLATFORM_COMMISSION_RATE="${process.env.PLATFORM_COMMISSION_RATE}", falling back to 0.10`);
  return 0.10;
})();
const AUTO_RELEASE_HOURS = parseInt(process.env.AUTO_RELEASE_HOURS || '24', 10);
const HOURS_TO_MS = 60 * 60 * 1000;

export class MockPaymentService implements IPaymentService {
  async initiatePayment(consultationId: string, patientId: string, amount: number): Promise<PaymentResult> {
    const transaction = await transactionRepository.create({
      userId: patientId,
      consultationId,
      amount,
      type: TransactionType.payment,
      status: TransactionStatus.pending,
      transactionMode: TransactionMode.mock,
      isRealMoney: false,
      description: `Mock payment initiation for consultation ${consultationId}`,
    });

    logger.info(`Mock payment initiated: txn=${transaction.id}, consultation=${consultationId}`);

    return {
      transactionId: transaction.id,
      status: transaction.status,
      amount,
      consultationId,
    };
  }

  async setMockOutcome(transactionId: string, outcome: 'success' | 'failure' | 'timeout'): Promise<void> {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.transactionMode !== TransactionMode.mock) throw new Error('Not a mock transaction');

    await transactionRepository.update(transactionId, { mockOutcome: outcome });

    if (outcome === 'success') {
      await this.processEscrowHold(transactionId);
    } else if (outcome === 'failure') {
      await transactionRepository.update(transactionId, {
        status: TransactionStatus.failed,
        mockOutcome: outcome,
      });
    } else if (outcome === 'timeout') {
      await transactionRepository.update(transactionId, {
        status: TransactionStatus.failed,
        mockOutcome: outcome,
      });
    }

    logger.info(`Mock outcome set: txn=${transactionId}, outcome=${outcome}`);
  }

  async processEscrowHold(transactionId: string): Promise<void> {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    const amount = Number(transaction.amount);
    const patientWallet = await walletRepository.findByUserId(transaction.userId);
    if (!patientWallet || Number(patientWallet.balance) < amount) {
      await transactionRepository.update(transactionId, { status: TransactionStatus.failed });
      throw new Error('Insufficient wallet balance');
    }

    await walletRepository.decrementBalance(transaction.userId, amount);

    const autoReleaseAt = new Date(Date.now() + AUTO_RELEASE_HOURS * HOURS_TO_MS);

    await transactionRepository.update(transactionId, {
      status: TransactionStatus.completed,
      escrowState: EscrowState.held,
    });

    if (transaction.consultationId) {
      await consultationRepository.update(transaction.consultationId, {
        status: ConsultationStatus.accepted,
        autoReleaseAt,
      });
    }

    // Create escrow record
    await transactionRepository.create({
      userId: transaction.userId,
      consultationId: transaction.consultationId ?? undefined,
      amount,
      type: TransactionType.escrow_hold,
      status: TransactionStatus.completed,
      transactionMode: TransactionMode.mock,
      isRealMoney: false,
      escrowState: EscrowState.held,
      description: `Escrow hold for transaction ${transactionId}`,
    });

    logger.info(`Escrow held: txn=${transactionId}, amount=${amount}`);
  }

  async releaseEscrow(transactionId: string): Promise<void> {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.escrowState !== EscrowState.held) throw new Error('Transaction not in escrow held state');

    const amount = Number(transaction.amount);
    const commission = amount * COMMISSION_RATE;
    const doctorAmount = amount - commission;

    if (!transaction.consultationId) throw new Error('No consultation associated with transaction');

    const consultation = await consultationRepository.findById(transaction.consultationId);
    if (!consultation) throw new Error('Consultation not found');

    // Release to doctor wallet
    await walletRepository.incrementBalance(consultation.doctorId, doctorAmount);

    await transactionRepository.update(transactionId, {
      escrowState: EscrowState.released,
      status: TransactionStatus.completed,
    });

    // Escrow release transaction
    await transactionRepository.create({
      userId: consultation.doctorId,
      consultationId: transaction.consultationId,
      amount: doctorAmount,
      type: TransactionType.escrow_release,
      status: TransactionStatus.completed,
      transactionMode: TransactionMode.mock,
      isRealMoney: false,
      escrowState: EscrowState.released,
      description: `Escrow release (after ${COMMISSION_RATE * 100}% commission)`,
    });

    await transactionRepository.create({
      userId: consultation.doctorId,
      consultationId: transaction.consultationId,
      amount: commission,
      type: TransactionType.commission,
      status: TransactionStatus.completed,
      transactionMode: TransactionMode.mock,
      isRealMoney: false,
      description: `Platform commission ${COMMISSION_RATE * 100}%`,
    });

    logger.info(`Escrow released: txn=${transactionId}, doctorAmount=${doctorAmount}, commission=${commission}`);
  }

  async processRefund(transactionId: string): Promise<void> {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.escrowState !== EscrowState.held) throw new Error('Transaction not in escrow held state');

    const amount = Number(transaction.amount);

    await walletRepository.incrementBalance(transaction.userId, amount);

    await transactionRepository.update(transactionId, {
      escrowState: EscrowState.refunded,
      status: TransactionStatus.refunded,
    });

    await transactionRepository.create({
      userId: transaction.userId,
      consultationId: transaction.consultationId ?? undefined,
      amount,
      type: TransactionType.refund,
      status: TransactionStatus.completed,
      transactionMode: TransactionMode.mock,
      isRealMoney: false,
      description: `Refund for transaction ${transactionId}`,
    });

    logger.info(`Refund processed: txn=${transactionId}, amount=${amount}`);
  }

  async processDoctorWithdrawal(doctorId: string, amount: number): Promise<WithdrawalResult> {
    const wallet = await walletRepository.findByUserId(doctorId);
    if (!wallet) throw new Error('Wallet not found');
    if (Number(wallet.balance) < amount) throw new Error('Insufficient balance');

    const updatedWallet = await walletRepository.decrementBalance(doctorId, amount);

    const transaction = await transactionRepository.create({
      userId: doctorId,
      amount,
      type: TransactionType.withdrawal,
      status: TransactionStatus.completed,
      transactionMode: TransactionMode.mock,
      isRealMoney: false,
      description: `Doctor withdrawal of ${amount}`,
    });

    logger.info(`Doctor withdrawal: doctorId=${doctorId}, amount=${amount}`);

    return {
      wallet: updatedWallet,
      transaction,
    };
  }
}
