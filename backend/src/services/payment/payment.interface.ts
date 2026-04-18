export interface PaymentResult {
  transactionId: string;
  status: string;
  amount: number;
  consultationId: string;
}

export interface WithdrawalResult {
  wallet: unknown;
  transaction: unknown;
}

export interface IPaymentService {
  initiatePayment(consultationId: string, patientId: string, amount: number): Promise<PaymentResult>;
  processEscrowHold(transactionId: string): Promise<void>;
  releaseEscrow(transactionId: string): Promise<void>;
  processRefund(transactionId: string): Promise<void>;
  processDoctorWithdrawal(doctorId: string, amount: number): Promise<WithdrawalResult>;
}
