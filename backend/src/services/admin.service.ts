import { userRepository } from '../repositories/user.repository';
import { transactionRepository } from '../repositories/transaction.repository';
import { walletRepository } from '../repositories/wallet.repository';
import { ratingRepository } from '../repositories/rating.repository';
import { MockPaymentService } from './payment/mock-payment.service';

const mockPaymentService = new MockPaymentService();

export const adminService = {
  async listUsers(page?: number, limit?: number) {
    return userRepository.findAll(page, limit);
  },

  async verifyUser(id: string, isVerified: boolean) {
    const user = await userRepository.findById(id);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    return userRepository.update(id, { isVerified });
  },

  async toggleUserActive(id: string, isActive: boolean) {
    const user = await userRepository.findById(id);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    return userRepository.update(id, { isActive });
  },

  async deleteRating(id: string) {
    const rating = await ratingRepository.findById(id);
    if (!rating) throw Object.assign(new Error('Rating not found'), { statusCode: 404 });
    return ratingRepository.delete(id);
  },

  async toggleHideRating(id: string, isHidden: boolean) {
    const rating = await ratingRepository.findById(id);
    if (!rating) throw Object.assign(new Error('Rating not found'), { statusCode: 404 });
    return ratingRepository.update(id, { isHidden });
  },

  async listMockPayments(page?: number, limit?: number) {
    return transactionRepository.findMockTransactions(page, limit);
  },

  async triggerMockOutcome(transactionId: string, outcome: 'success' | 'failure' | 'timeout') {
    return mockPaymentService.setMockOutcome(transactionId, outcome);
  },

  async resetWallets() {
    return walletRepository.resetAll();
  },

  async getEscrowStates() {
    return transactionRepository.findEscrowTransactions();
  },
};
