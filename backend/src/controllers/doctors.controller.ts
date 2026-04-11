import { Response } from 'express';
import { AuthRequest } from '../types';
import { doctorsService } from '../services/doctors.service';

export const doctorsController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { specialty, name } = req.query as { specialty?: string; name?: string };
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;
      const result = await doctorsService.getAll({ specialty, name }, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const doctor = await doctorsService.getById(id);
      res.json({ success: true, data: doctor });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getMyProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await doctorsService.getByUserId(userId);
      res.json({ success: true, data: profile });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      if (error.statusCode === 404) {
        res.json({ success: true, data: null });
        return;
      }
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async createProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await doctorsService.createProfile(userId, req.body);
      res.status(201).json({ success: true, data: profile });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await doctorsService.updateProfile(userId, req.body);
      res.json({ success: true, data: profile });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async deleteProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      await doctorsService.deleteProfile(userId);
      res.json({ success: true, message: 'Doctor profile deleted' });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
