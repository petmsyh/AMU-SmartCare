import { userRepository } from '../repositories/user.repository';
import { Prisma } from '@prisma/client';

export const usersService = {
  async getAll(page?: number, limit?: number) {
    return userRepository.findAll(page, limit);
  },

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    const { passwordHash: _ph1, ...safeUser } = user;
    return safeUser;
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    const existing = await userRepository.findById(id);
    if (!existing) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    const updated = await userRepository.update(id, data);
    const { passwordHash: _ph2, ...safeUser } = updated;
    return safeUser;
  },

  async delete(id: string) {
    const existing = await userRepository.findById(id);
    if (!existing) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    return userRepository.delete(id);
  },
};
