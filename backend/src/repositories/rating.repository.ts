import { prisma } from '../app';
import { Prisma } from '@prisma/client';

export const ratingRepository = {
  async create(data: { patientId: string; doctorId: string; consultationId?: string; score: number; comment?: string }) {
    return prisma.rating.create({ data });
  },

  async findByDoctor(doctorId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { doctorId, isHidden: false },
        skip,
        take: limit,
        include: { patient: { select: { id: true, username: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.rating.count({ where: { doctorId, isHidden: false } }),
    ]);
    return { ratings, total, page, limit };
  },

  async findById(id: string) {
    return prisma.rating.findUnique({ where: { id } });
  },

  async update(id: string, data: Prisma.RatingUpdateInput) {
    return prisma.rating.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.rating.delete({ where: { id } });
  },

  async findByConsultationAndPatient(consultationId: string, patientId: string) {
    return prisma.rating.findFirst({ where: { consultationId, patientId } });
  },
};
