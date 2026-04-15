import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { callsController } from '../controllers/calls.controller';

const router = Router();

router.use(authMiddleware);

router.post('/rooms/:consultationId', callsController.createOrGetRoom);
router.get('/rooms/:roomId', callsController.getRoom);
router.patch('/rooms/:roomId', callsController.updateRoomStatus);
router.get('/rooms/:roomId/signals', callsController.listSignals);
router.post('/rooms/:roomId/signals', callsController.createSignal);

export default router;
