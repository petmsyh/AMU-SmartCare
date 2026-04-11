import { prisma } from '../app';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  async create(data: { email: string; username: string; passwordHash: string; role: Role }) {
    return prisma.user.create({
      data: {
        ...data,
        wallet: { create: { balance: 0 } },
      },
    });
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.user.count(),
    ]);
    return { users, total, page, limit };
  },
};
