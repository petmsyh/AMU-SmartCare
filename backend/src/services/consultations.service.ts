import { consultationRepository } from '../repositories/consultation.repository';
import { ConsultationStatus, Role } from '@prisma/client';
import { prisma } from '../app';

export const consultationsService = {
  async request(patientId: string, doctorId: string, scheduledAt?: Date, notes?: string) {
    const doctor = await prisma.user.findUnique({ where: { id: doctorId } });
    if (!doctor) throw Object.assign(new Error('Doctor not found'), { statusCode: 404 });
    if (doctor.role !== Role.doctor) throw Object.assign(new Error('Target user is not a doctor'), { statusCode: 400 });

    return consultationRepository.create({ patientId, doctorId, scheduledAt, notes });
  },

  async getMyConsultations(userId: string, role: string, page?: number, limit?: number) {
    const r = role === 'doctor' ? 'doctor' : 'patient';
    return consultationRepository.findByUser(userId, r, page, limit);
  },

  async getById(id: string, userId: string) {
    const consultation = await consultationRepository.findById(id);
    if (!consultation) throw Object.assign(new Error('Consultation not found'), { statusCode: 404 });
    if (consultation.patientId !== userId && consultation.doctorId !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }
    return consultation;
  },

  async accept(id: string, doctorId: string) {
    const consultation = await consultationRepository.findById(id);
    if (!consultation) throw Object.assign(new Error('Consultation not found'), { statusCode: 404 });
    if (consultation.doctorId !== doctorId) throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    if (consultation.status !== ConsultationStatus.pending) {
      throw Object.assign(new Error('Consultation cannot be accepted in current status'), { statusCode: 400 });
    }
    return consultationRepository.updateStatus(id, ConsultationStatus.accepted);
  },

  async decline(id: string, doctorId: string) {
    const consultation = await consultationRepository.findById(id);
    if (!consultation) throw Object.assign(new Error('Consultation not found'), { statusCode: 404 });
    if (consultation.doctorId !== doctorId) throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    if (consultation.status !== ConsultationStatus.pending) {
      throw Object.assign(new Error('Consultation cannot be declined in current status'), { statusCode: 400 });
    }
    return consultationRepository.updateStatus(id, ConsultationStatus.declined);
  },

  async confirmComplete(id: string, userId: string) {
    const consultation = await consultationRepository.findById(id);
    if (!consultation) throw Object.assign(new Error('Consultation not found'), { statusCode: 404 });
    if (consultation.patientId !== userId && consultation.doctorId !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }

    const isPatient = consultation.patientId === userId;
    const update = isPatient ? { patientConfirmed: true } : { doctorConfirmed: true };

    const updated = await consultationRepository.update(id, update);

    if (updated.patientConfirmed && updated.doctorConfirmed) {
      return consultationRepository.updateStatus(id, ConsultationStatus.completed);
    }

    return updated;
  },

  async dispute(id: string, patientId: string) {
    const consultation = await consultationRepository.findById(id);
    if (!consultation) throw Object.assign(new Error('Consultation not found'), { statusCode: 404 });
    if (consultation.patientId !== patientId) throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    const allowedStatuses: ConsultationStatus[] = [ConsultationStatus.accepted, ConsultationStatus.in_progress];
    if (!allowedStatuses.includes(consultation.status)) {
      throw Object.assign(new Error('Dispute can only be raised on accepted or in-progress consultations'), { statusCode: 400 });
    }
    return consultationRepository.updateStatus(id, ConsultationStatus.disputed);
  },
};
