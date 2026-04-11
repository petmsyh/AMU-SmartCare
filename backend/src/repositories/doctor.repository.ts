import { prisma } from '../app';
import { DoctorTier, Prisma } from '@prisma/client';

export const doctorRepository = {
  async findByUserId(userId: string) {
    return prisma.doctorProfile.findUnique({ where: { userId }, include: { user: true } });
  },

  async findById(id: string) {
    return prisma.doctorProfile.findUnique({ where: { id }, include: { user: true } });
  },

  async create(userId: string, data: {
    fullName: string;
    specialty: string;
    experience?: number;
    bio?: string;
    contactInfo?: string;
    profilePictureUrl?: string;
    certifications?: Prisma.InputJsonValue;
    consultationFee?: number;
    tier?: DoctorTier;
    availabilitySchedule?: Prisma.InputJsonValue;
  }) {
    return prisma.doctorProfile.create({
      data: { userId, ...data },
      include: { user: true },
    });
  },

  async update(userId: string, data: Prisma.DoctorProfileUpdateInput) {
    return prisma.doctorProfile.update({ where: { userId }, data, include: { user: true } });
  },

  async delete(userId: string) {
    return prisma.doctorProfile.delete({ where: { userId } });
  },

  async findAll(filters: { specialty?: string; name?: string }, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.DoctorProfileWhereInput = {};

    if (filters.specialty) {
      where.specialty = { contains: filters.specialty, mode: 'insensitive' };
    }
    if (filters.name) {
      where.fullName = { contains: filters.name, mode: 'insensitive' };
    }

    const [doctors, total] = await Promise.all([
      prisma.doctorProfile.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { id: true, email: true, username: true, isVerified: true, isActive: true } } },
        orderBy: { averageRating: 'desc' },
      }),
      prisma.doctorProfile.count({ where }),
    ]);
    return { doctors, total, page, limit };
  },
};
