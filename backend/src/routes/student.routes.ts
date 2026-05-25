import { Router } from 'express';
import { studentController } from '../controllers/student.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/course-materials', authMiddleware, studentController.listCourseMaterials);

export default router;
