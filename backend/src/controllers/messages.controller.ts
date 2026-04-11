import { Response } from 'express';
import { AuthRequest } from '../types';
import { messagesService } from '../services/messages.service';

export const messagesController = {
  async getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { consultationId } = req.params;
      const userId = req.user!.id;
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 50;
      const result = await messagesService.getMessages(consultationId, userId, page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },

  async sendMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { consultationId } = req.params;
      const senderId = req.user!.id;
      const { content } = req.body as { content: string };
      const message = await messagesService.sendMessage(consultationId, senderId, content);
      res.status(201).json({ success: true, data: message });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  },
};
