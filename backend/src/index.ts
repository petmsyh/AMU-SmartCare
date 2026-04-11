import dotenv from 'dotenv';
dotenv.config();

import app, { prisma, logger } from './app';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.warn('Database connection failed (continuing without DB):', err);
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

bootstrap();
