import { Router } from 'express';
import { ratingsController } from '../controllers/ratings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

const createRatingSchema = z.object({
  doctorId: z.string().uuid(),
  consultationId: z.string().uuid().optional(),
  score: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

router.post('/', authMiddleware, requireRole('patient'), validate(createRatingSchema), ratingsController.create);
router.get('/doctor/:doctorId', ratingsController.getByDoctor);
router.delete('/:id', authMiddleware, requireRole('admin'), ratingsController.delete);
router.patch('/:id/hide', authMiddleware, requireRole('admin'), ratingsController.hide);

export default router;
