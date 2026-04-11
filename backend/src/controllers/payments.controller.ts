import { Response } from 'express';
import { AuthRequest } from '../types';
import { paymentService } from '../services/payment/payment.factory';
import { MockPaymentService } from '../services/payment/mock-payment.service';
import { walletRepository } from '../repositories/wallet.repository';
import { transactionRepository } from '../repositories/transaction.repository';
import { doctorRepository } from '../repositories/doctor.repository';
import { consultationRepository } from '../repositories/consultation.repository';

export const paymentsController = {
  async initiatePayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const patientId = req.user!.id;
      const { consultationId } = req.body as { consultationId: string };

      const consultation = await consultationRepository.findById(consultationId);
      if (!consultation) {
        res.status(404).json({ success: false, error: 'Consultation not found' });
        return;
      }
      if (consultation.patientId !== patientId) {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }

      const doctorProfile = await doctorRepository.findByUserId(consultation.doctorId);
      const amount = doctorProfile ? Number(doctorProfile.consultationFee) : 0;

      const result = await paymentService.initiatePayment(consultationId, patientId, amount);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async setMockOutcome(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!(paymentService instanceof MockPaymentService)) {
        res.status(400).json({ success: false, error: 'Not in mock mode' });
        return;
      }
      const { transactionId, outcome } = req.body as { transactionId: string; outcome: 'success' | 'failure' | 'timeout' };
      await paymentService.setMockOutcome(transactionId, outcome);
      res.json({ success: true, message: `Mock outcome '${outcome}' applied` });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async confirmComplete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { transactionId } = req.body as { transactionId: string };
      await paymentService.releaseEscrow(transactionId);
      res.json({ success: true, message: 'Escrow released' });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async requestRefund(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { transactionId } = req.body as { transactionId: string };
      await paymentService.processRefund(transactionId);
      res.json({ success: true, message: 'Refund processed' });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async withdraw(req: AuthRequest, res: Response): Promise<void> {
    try {
      const doctorId = req.user!.id;
      const { amount } = req.body as { amount: number };
      await paymentService.processDoctorWithdrawal(doctorId, amount);
      res.json({ success: true, message: 'Withdrawal processed' });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getWallet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const wallet = await walletRepository.findByUserId(userId);
      res.json({ success: true, data: wallet });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;
      const result = await transactionRepository.findByUser(userId, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
