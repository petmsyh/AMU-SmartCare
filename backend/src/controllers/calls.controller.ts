import { Response } from 'express';
import { CallSignalType, CallStatus, CallType } from '@prisma/client';
import { AuthRequest } from '../types';
import { callsService } from '../services/calls.service';

export const callsController = {
  async createOrGetRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { consultationId } = req.params;
      const { type, scheduledFor } = req.body as { type?: CallType; scheduledFor?: string };
      const room = await callsService.getOrCreateRoom(
        consultationId,
        req.user!.id,
        type ?? 'video',
        scheduledFor
      );
      res.json({ success: true, data: room });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async getRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const room = await callsService.getRoom(roomId, req.user!.id);
      res.json({ success: true, data: room });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async updateRoomStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const { status } = req.body as { status: CallStatus };
      const room = await callsService.updateRoomStatus(roomId, req.user!.id, status);
      res.json({ success: true, data: room });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async createSignal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const { toUserId, type, payload } = req.body as {
        toUserId?: string | null;
        type: CallSignalType;
        payload: unknown;
      };
      const signal = await callsService.createSignal(roomId, req.user!.id, {
        toUserId,
        type,
        payload,
      });
      res.status(201).json({ success: true, data: signal });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async listSignals(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const after = typeof req.query.after === 'string' ? req.query.after : undefined;
      const signals = await callsService.listSignals(roomId, req.user!.id, after);
      res.json({ success: true, data: signals });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
