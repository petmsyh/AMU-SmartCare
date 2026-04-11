import { IPaymentService } from './payment.interface';
import { MockPaymentService } from './mock-payment.service';
import { LivePaymentService } from './live-payment.service';

export function createPaymentService(): IPaymentService {
  const mode = process.env.PAYMENT_MODE || 'mock';
  if (mode === 'live') {
    return new LivePaymentService();
  }
  return new MockPaymentService();
}

export const paymentService = createPaymentService();
