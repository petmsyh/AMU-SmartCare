import { Router } from 'express';
import { paymentsController } from '../controllers/payments.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/initiate', requireRole('patient'), paymentsController.initiatePayment);
router.post('/mock-outcome', requireRole('patient'), paymentsController.setMockOutcome);
router.post('/confirm-complete', paymentsController.confirmComplete);
router.post('/request-refund', requireRole('patient'), paymentsController.requestRefund);
router.post('/withdraw', requireRole('doctor'), paymentsController.withdraw);
router.get('/wallet', paymentsController.getWallet);
router.get('/transactions', paymentsController.getTransactions);

export default router;
