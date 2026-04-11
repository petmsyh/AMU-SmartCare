import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/error.middleware';
import { logger } from './utils/logger';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import doctorsRoutes from './routes/doctors.routes';
import consultationsRoutes from './routes/consultations.routes';
import messagesRoutes from './routes/messages.routes';
import ratingsRoutes from './routes/ratings.routes';
import paymentsRoutes from './routes/payments.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

export const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/consultations', consultationsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use(errorMiddleware);

export { logger };
export default app;
