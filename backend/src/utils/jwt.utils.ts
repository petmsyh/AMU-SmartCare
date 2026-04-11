import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable must be set in production');
  }
  console.warn('[WARN] JWT_SECRET is not set. Using a fallback — do not use in production.');
}
const SECRET = JWT_SECRET || 'fallback_secret_do_not_use_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload;
  return {
    userId: decoded['userId'] as string,
    email: decoded['email'] as string,
    role: decoded['role'] as Role,
  };
}
