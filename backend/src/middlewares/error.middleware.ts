import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error('Unhandled error:', err.message, err.stack);

  const statusCode = (err as Error & { statusCode?: number }).statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
