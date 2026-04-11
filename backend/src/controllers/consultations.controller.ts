import { Response } from 'express';
import { AuthRequest } from '../types';
import { consultationsService } from '../services/consultations.service';

export const consultationsController = {
  async request(req: AuthRequest, res: Response): Promise<void> {
    try {
      const patientId = req.user!.id;
      const { doctorId, scheduledAt, notes } = req.body as { doctorId: string; scheduledAt?: string; notes?: string };
      const consultation = await consultationsService.request(
        patientId,
        doctorId,
        scheduledAt ? new Date(scheduledAt) : undefined,
        notes
      );
      res.status(201).json({ success: true, data: consultation });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;
      const result = await consultationsService.getMyConsultations(userId, role, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const consultation = await consultationsService.getById(id, userId);
      res.json({ success: true, data: consultation });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async accept(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const doctorId = req.user!.id;
      const consultation = await consultationsService.accept(id, doctorId);
      res.json({ success: true, data: consultation });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async decline(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const doctorId = req.user!.id;
      const consultation = await consultationsService.decline(id, doctorId);
      res.json({ success: true, data: consultation });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async confirmComplete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const consultation = await consultationsService.confirmComplete(id, userId);
      res.json({ success: true, data: consultation });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async dispute(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const patientId = req.user!.id;
      const consultation = await consultationsService.dispute(id, patientId);
      res.json({ success: true, data: consultation });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
