import { messageRepository } from '../repositories/message.repository';
import { consultationRepository } from '../repositories/consultation.repository';

export const messagesService = {
  async getMessages(consultationId: string, userId: string, page?: number, limit?: number) {
    const consultation = await consultationRepository.findById(consultationId);
    if (!consultation) throw Object.assign(new Error('Consultation not found'), { statusCode: 404 });
    if (consultation.patientId !== userId && consultation.doctorId !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }
    return messageRepository.findByConsultation(consultationId, page, limit);
  },

  async sendMessage(consultationId: string, senderId: string, content: string) {
    const consultation = await consultationRepository.findById(consultationId);
    if (!consultation) throw Object.assign(new Error('Consultation not found'), { statusCode: 404 });
    if (consultation.patientId !== senderId && consultation.doctorId !== senderId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }
    return messageRepository.create({ consultationId, senderId, content });
  },
};
