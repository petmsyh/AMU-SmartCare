import { Response } from 'express';
import { AuthRequest } from '../types';
import { usersService } from '../services/users.service';

export const usersController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;
      const result = await usersService.getAll(page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await usersService.getById(id);
      res.json({ success: true, data: user });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const currentUser = req.user!;
      if (currentUser.role !== 'admin' && currentUser.id !== id) {
        res.status(403).json({ success: false, error: 'Access denied' });
        return;
      }
      const { passwordHash: _ph, role: _role, ...allowedFields } = req.body;
      const user = await usersService.update(id, allowedFields);
      res.json({ success: true, data: user });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await usersService.delete(id);
      res.json({ success: true, message: 'User deleted' });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
