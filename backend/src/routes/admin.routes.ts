import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authMiddleware, requireRole('admin'));

router.get('/users', adminController.listUsers);
router.patch('/users/:id/verify', adminController.verifyUser);
router.patch('/users/:id/disable', adminController.toggleUserActive);
router.delete('/ratings/:id', adminController.deleteRating);
router.patch('/ratings/:id/hide', adminController.toggleHideRating);
router.get('/mock-payments', adminController.listMockPayments);
router.post('/mock-payments/:id/trigger', adminController.triggerMockOutcome);
router.post('/mock-payments/reset-wallets', adminController.resetWallets);
router.get('/mock-payments/escrow', adminController.getEscrowStates);

export default router;
