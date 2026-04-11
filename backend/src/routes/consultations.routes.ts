import { Router } from 'express';
import { consultationsController } from '../controllers/consultations.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', requireRole('patient'), consultationsController.request);
router.post('/request', requireRole('patient'), consultationsController.request);
router.get('/', consultationsController.getAll);
router.get('/:id', consultationsController.getById);
router.patch('/:id/accept', requireRole('doctor'), consultationsController.accept);
router.patch('/:id/decline', requireRole('doctor'), consultationsController.decline);
router.patch('/:id/confirm-complete', consultationsController.confirmComplete);
router.patch('/:id/confirm', consultationsController.confirmComplete);
router.post('/:id/dispute', requireRole('patient'), consultationsController.dispute);

export default router;
