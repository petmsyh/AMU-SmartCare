import { Router } from 'express';
import { messagesController } from '../controllers/messages.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});

router.get('/consultation/:consultationId', messagesController.getMessages);
router.post('/consultation/:consultationId', validate(sendMessageSchema), messagesController.sendMessage);

export default router;
