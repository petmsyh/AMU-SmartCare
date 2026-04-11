import { Response } from 'express';
import { AuthRequest } from '../types';
import { authService } from '../services/auth.service';
import { Role } from '@prisma/client';

export const authController = {
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, username, password, role } = req.body as { email: string; username: string; password: string; role: Role };
      const result = await authService.register(email, username, password, role || Role.patient);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await authService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await authService.me(userId);
      res.json({ success: true, data: user });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
