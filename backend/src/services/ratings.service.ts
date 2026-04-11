import { ratingRepository } from '../repositories/rating.repository';
import { doctorRepository } from '../repositories/doctor.repository';
import { consultationRepository } from '../repositories/consultation.repository';
import { ConsultationStatus } from '@prisma/client';
import { prisma } from '../app';

export const ratingsService = {
  async create(patientId: string, doctorId: string, consultationId: string | undefined, score: number, comment?: string) {
    if (score < 1 || score > 5) throw Object.assign(new Error('Score must be between 1 and 5'), { statusCode: 400 });

    if (consultationId) {
      const consultation = await consultationRepository.findById(consultationId);
      if (!consultation) throw Object.assign(new Error('Consultation not found'), { statusCode: 404 });
      if (consultation.patientId !== patientId) throw Object.assign(new Error('Access denied'), { statusCode: 403 });
      if (consultation.status !== ConsultationStatus.completed) {
        throw Object.assign(new Error('Can only rate completed consultations'), { statusCode: 400 });
      }
      const existing = await ratingRepository.findByConsultationAndPatient(consultationId, patientId);
      if (existing) throw Object.assign(new Error('Already rated this consultation'), { statusCode: 409 });
    }

    const rating = await ratingRepository.create({ patientId, doctorId, consultationId, score, comment });

    // Update doctor average rating
    const allRatings = await prisma.rating.findMany({ where: { doctorId, isHidden: false } });
    const avg = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;
    await doctorRepository.update(doctorId, { averageRating: avg, totalRatings: allRatings.length });

    return rating;
  },

  async getByDoctor(doctorId: string, page?: number, limit?: number) {
    return ratingRepository.findByDoctor(doctorId, page, limit);
  },

  async delete(id: string) {
    const rating = await ratingRepository.findById(id);
    if (!rating) throw Object.assign(new Error('Rating not found'), { statusCode: 404 });
    return ratingRepository.delete(id);
  },

  async toggleHide(id: string, isHidden: boolean) {
    const rating = await ratingRepository.findById(id);
    if (!rating) throw Object.assign(new Error('Rating not found'), { statusCode: 404 });
    return ratingRepository.update(id, { isHidden });
  },
};
