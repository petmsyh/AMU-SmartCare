import { IPaymentService, PaymentResult } from './payment.interface';

export class LivePaymentService implements IPaymentService {
  async initiatePayment(_consultationId: string, _patientId: string, _amount: number): Promise<PaymentResult> {
    throw new Error('Live payment not implemented');
  }

  async processEscrowHold(_transactionId: string): Promise<void> {
    throw new Error('Live payment not implemented');
  }

  async releaseEscrow(_transactionId: string): Promise<void> {
    throw new Error('Live payment not implemented');
  }

  async processRefund(_transactionId: string): Promise<void> {
    throw new Error('Live payment not implemented');
  }

  async processDoctorWithdrawal(_doctorId: string, _amount: number): Promise<void> {
    throw new Error('Live payment not implemented');
  }
}
