import { Response } from 'express';
import { AuthRequest } from '../types';
import { adminService } from '../services/admin.service';

export const adminController = {
  async listUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;
      const result = await adminService.listUsers(page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async verifyUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isVerified } = req.body as { isVerified: boolean };
      const user = await adminService.verifyUser(id, isVerified !== false);
      res.json({ success: true, data: user });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async toggleUserActive(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body as { isActive: boolean };
      const user = await adminService.toggleUserActive(id, isActive !== false);
      res.json({ success: true, data: user });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async deleteRating(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await adminService.deleteRating(id);
      res.json({ success: true, message: 'Rating deleted' });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async toggleHideRating(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isHidden } = req.body as { isHidden: boolean };
      const rating = await adminService.toggleHideRating(id, isHidden !== false);
      res.json({ success: true, data: rating });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async listMockPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 50;
      const result = await adminService.listMockPayments(page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async triggerMockOutcome(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { outcome } = req.body as { outcome: 'success' | 'failure' | 'timeout' };
      await adminService.triggerMockOutcome(id, outcome);
      res.json({ success: true, message: `Outcome '${outcome}' triggered` });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async resetWallets(_req: AuthRequest, res: Response): Promise<void> {
    try {
      await adminService.resetWallets();
      res.json({ success: true, message: 'All wallet balances reset to 0' });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getEscrowStates(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await adminService.getEscrowStates();
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
