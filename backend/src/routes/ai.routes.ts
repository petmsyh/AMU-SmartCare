import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/chat', authMiddleware, aiController.chat);
router.get('/sessions', authMiddleware, aiController.listSessions);
router.post('/sessions', authMiddleware, aiController.createSession);
router.get('/sessions/:sessionId/messages', authMiddleware, aiController.getSessionMessages);

export default router;
