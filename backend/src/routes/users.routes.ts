import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', requireRole('admin'), usersController.getAll);
router.get('/:id', usersController.getById);
router.patch('/:id', usersController.update);
router.delete('/:id', requireRole('admin'), usersController.delete);

export default router;
