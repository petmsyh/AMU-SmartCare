import { Response } from 'express';
import { AuthRequest } from '../types';
import { ratingsService } from '../services/ratings.service';

export const ratingsController = {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const patientId = req.user!.id;
      const { doctorId, consultationId, score, comment } = req.body as {
        doctorId: string; consultationId?: string; score: number; comment?: string;
      };
      const rating = await ratingsService.create(patientId, doctorId, consultationId, score, comment);
      res.status(201).json({ success: true, data: rating });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getByDoctor(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { doctorId } = req.params;
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;
      const result = await ratingsService.getByDoctor(doctorId, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ratingsService.delete(id);
      res.json({ success: true, message: 'Rating deleted' });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async hide(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isHidden } = req.body as { isHidden: boolean };
      const rating = await ratingsService.toggleHide(id, isHidden);
      res.json({ success: true, data: rating });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
