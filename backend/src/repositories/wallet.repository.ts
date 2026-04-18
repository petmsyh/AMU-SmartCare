import { prisma } from '../app';
import { Prisma } from '@prisma/client';

export const walletRepository = {
  async findByUserId(userId: string) {
    return prisma.wallet.findUnique({ where: { userId } });
  },

  async findOrCreateByUserId(userId: string) {
    return prisma.wallet.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        balance: 0,
      },
    });
  },

  async findOrCreateByUserId(userId: string) {
    return prisma.wallet.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        balance: 0,
      },
    });
  },

  async update(userId: string, data: Prisma.WalletUpdateInput) {
    return prisma.wallet.update({ where: { userId }, data });
  },

  async incrementBalance(userId: string, amount: number) {
    return prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });
  },

  async decrementBalance(userId: string, amount: number) {
    return prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });
  },

  async resetAll() {
    return prisma.wallet.updateMany({ data: { balance: 0 } });
  },
};
