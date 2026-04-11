import { prisma } from '../app';
import { TransactionType, TransactionStatus, TransactionMode, EscrowState, Prisma } from '@prisma/client';

export const transactionRepository = {
  async create(data: {
    userId: string;
    consultationId?: string;
    amount: number | string;
    type: TransactionType;
    status?: TransactionStatus;
    transactionMode?: TransactionMode;
    mockOutcome?: string;
    isRealMoney?: boolean;
    escrowState?: EscrowState;
    description?: string;
  }) {
    return prisma.transaction.create({ data });
  },

  async findById(id: string) {
    return prisma.transaction.findUnique({ where: { id } });
  },

  async update(id: string, data: Prisma.TransactionUpdateInput) {
    return prisma.transaction.update({ where: { id }, data });
  },

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where: { userId } }),
    ]);
    return { transactions, total, page, limit };
  },

  async findAll(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        skip,
        take: limit,
        include: { user: { select: { id: true, username: true, email: true } }, consultation: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count(),
    ]);
    return { transactions, total, page, limit };
  },

  async findMockTransactions(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { transactionMode: TransactionMode.mock },
        skip,
        take: limit,
        include: { user: { select: { id: true, username: true, email: true } }, consultation: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where: { transactionMode: TransactionMode.mock } }),
    ]);
    return { transactions, total, page, limit };
  },

  async findEscrowTransactions() {
    return prisma.transaction.findMany({
      where: { escrowState: { not: null } },
      include: { user: { select: { id: true, username: true } }, consultation: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByConsultation(consultationId: string) {
    return prisma.transaction.findMany({ where: { consultationId } });
  },
};
