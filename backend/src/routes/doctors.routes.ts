import { Router } from 'express';
import { doctorsController } from '../controllers/doctors.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.get('/', doctorsController.getAll);
router.get('/:id', doctorsController.getById);

router.post('/profile', authMiddleware, requireRole('doctor'), doctorsController.createProfile);
router.patch('/profile', authMiddleware, requireRole('doctor'), doctorsController.updateProfile);
router.delete('/profile', authMiddleware, requireRole('doctor'), doctorsController.deleteProfile);

export default router;
