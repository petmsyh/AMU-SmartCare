import { userRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { signToken } from '../utils/jwt.utils';
import { Role } from '@prisma/client';

export const authService = {
  async register(email: string, username: string, password: string, role: Role) {
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) throw Object.assign(new Error('Email already in use'), { statusCode: 409 });

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) throw Object.assign(new Error('Username already in use'), { statusCode: 409 });

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({ email, username, passwordHash, role });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const { passwordHash: _ph1, ...safeUser } = user;
    return { user: safeUser, token };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

    if (!user.isActive) throw Object.assign(new Error('Account is disabled'), { statusCode: 403 });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const { passwordHash: _ph2, ...safeUser } = user;
    return { user: safeUser, token };
  },

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    const { passwordHash: _ph3, ...safeUser } = user;
    return safeUser;
  },
};
