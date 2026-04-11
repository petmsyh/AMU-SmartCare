import { prisma } from '../app';

export const messageRepository = {
  async create(data: { consultationId: string; senderId: string; content: string }) {
    return prisma.message.create({
      data,
      include: { sender: { select: { id: true, username: true, role: true } } },
    });
  },

  async findByConsultation(consultationId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { consultationId },
        skip,
        take: limit,
        include: { sender: { select: { id: true, username: true, role: true } } },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.message.count({ where: { consultationId } }),
    ]);
    return { messages, total, page, limit };
  },
};
