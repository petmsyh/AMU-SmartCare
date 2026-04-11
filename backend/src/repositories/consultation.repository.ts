import { prisma } from '../app';
import { ConsultationStatus, Prisma } from '@prisma/client';

export const consultationRepository = {
  async create(data: { patientId: string; doctorId: string; scheduledAt?: Date; notes?: string }) {
    return prisma.consultation.create({
      data,
      include: { patient: true, doctor: true },
    });
  },

  async findById(id: string) {
    return prisma.consultation.findUnique({
      where: { id },
      include: { patient: true, doctor: true, messages: true, ratings: true, transactions: true },
    });
  },

  async findByUser(userId: string, role: 'patient' | 'doctor', page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.ConsultationWhereInput = role === 'patient' ? { patientId: userId } : { doctorId: userId };
    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        skip,
        take: limit,
        include: { patient: true, doctor: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.consultation.count({ where }),
    ]);
    return { consultations, total, page, limit };
  },

  async update(id: string, data: Prisma.ConsultationUpdateInput) {
    return prisma.consultation.update({ where: { id }, data, include: { patient: true, doctor: true } });
  },

  async updateStatus(id: string, status: ConsultationStatus) {
    return prisma.consultation.update({ where: { id }, data: { status } });
  },
};
