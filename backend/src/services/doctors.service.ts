import { doctorRepository } from '../repositories/doctor.repository';
import { DoctorTier, Prisma } from '@prisma/client';

export const doctorsService = {
  async getAll(filters: { specialty?: string; name?: string }, page?: number, limit?: number) {
    return doctorRepository.findAll(filters, page, limit);
  },

  async getById(id: string) {
    const doctor = await doctorRepository.findById(id);
    if (!doctor) throw Object.assign(new Error('Doctor not found'), { statusCode: 404 });
    return doctor;
  },

  async getByUserId(userId: string) {
    const doctor = await doctorRepository.findByUserId(userId);
    if (!doctor) throw Object.assign(new Error('Doctor profile not found'), { statusCode: 404 });
    return doctor;
  },

  async createProfile(userId: string, data: {
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
    const existing = await doctorRepository.findByUserId(userId);
    if (existing) throw Object.assign(new Error('Doctor profile already exists'), { statusCode: 409 });
    return doctorRepository.create(userId, data);
  },

  async updateProfile(userId: string, data: Prisma.DoctorProfileUpdateInput) {
    const existing = await doctorRepository.findByUserId(userId);
    if (!existing) throw Object.assign(new Error('Doctor profile not found'), { statusCode: 404 });
    return doctorRepository.update(userId, data);
  },

  async deleteProfile(userId: string) {
    const existing = await doctorRepository.findByUserId(userId);
    if (!existing) throw Object.assign(new Error('Doctor profile not found'), { statusCode: 404 });
    return doctorRepository.delete(userId);
  },
};
