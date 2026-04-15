import { CallSignalType, CallStatus, CallType } from '@prisma/client';
import { prisma } from '../app';

function roomIdFromConsultationId(consultationId: string): string {
  return `appt-${normalizeConsultationId(consultationId)}`;
}

function normalizeConsultationId(value: string): string {
  return value.startsWith('appt-') ? value.slice(5) : value;
}

function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function getRoomOrThrow(roomId: string, userId: string) {
  const room = await prisma.callRoom.findUnique({
    where: { id: roomId },
    include: {
      consultation: true,
    },
  });

  if (!room) {
    throw Object.assign(new Error('Call room not found'), { statusCode: 404 });
  }

  if (!room.participantUserIds.includes(userId)) {
    throw Object.assign(new Error('Access denied'), { statusCode: 403 });
  }

  return room;
}

export const callsService = {
  async getOrCreateRoom(
    consultationId: string,
    userId: string,
    type: CallType,
    scheduledFor?: string
  ) {
    const normalizedConsultationId = normalizeConsultationId(consultationId);
    const consultation = await prisma.consultation.findUnique({
      where: { id: normalizedConsultationId },
      select: {
        id: true,
        patientId: true,
        doctorId: true,
        scheduledAt: true,
      },
    });

    if (!consultation) {
      throw Object.assign(new Error('Consultation not found'), { statusCode: 404 });
    }

    if (consultation.patientId !== userId && consultation.doctorId !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }

    const id = roomIdFromConsultationId(normalizedConsultationId);
    const participantUserIds = [consultation.patientId, consultation.doctorId];
    const existing = await prisma.callRoom.findUnique({ where: { id } });
    if (existing) {
      if (!existing.participantUserIds.includes(userId)) {
        throw Object.assign(new Error('Access denied'), { statusCode: 403 });
      }
      return existing;
    }

    return prisma.callRoom.create({
      data: {
        id,
        consultationId: normalizedConsultationId,
        hostUserId: consultation.doctorId,
        participantUserIds,
        scheduledFor: consultation.scheduledAt ?? toDate(scheduledFor) ?? undefined,
        type,
        status: CallStatus.scheduled,
      },
    });
  },

  async getRoom(roomId: string, userId: string) {
    try {
      return await getRoomOrThrow(roomId, userId);
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      if (error.statusCode !== 404 || !roomId.startsWith('appt-')) {
        throw error;
      }

      const consultationId = normalizeConsultationId(roomId);
      return this.getOrCreateRoom(consultationId, userId, CallType.video);
    }
  },

  async updateRoomStatus(roomId: string, userId: string, status: CallStatus) {
    await getRoomOrThrow(roomId, userId);
    return prisma.callRoom.update({
      where: { id: roomId },
      data: { status },
    });
  },

  async createSignal(
    roomId: string,
    userId: string,
    input: {
      toUserId?: string | null;
      type: CallSignalType;
      payload: unknown;
    }
  ) {
    const room = await getRoomOrThrow(roomId, userId);

    if (input.toUserId && !room.participantUserIds.includes(input.toUserId)) {
      throw Object.assign(new Error('Invalid recipient'), { statusCode: 400 });
    }

    return prisma.callSignal.create({
      data: {
        roomId,
        fromUserId: userId,
        toUserId: input.toUserId ?? null,
        type: input.type,
        payload: input.payload as never,
      },
    });
  },

  async listSignals(roomId: string, userId: string, after?: string) {
    await getRoomOrThrow(roomId, userId);
    return prisma.callSignal.findMany({
      where: {
        roomId,
        ...(after ? { createdAt: { gt: new Date(after) } } : {}),
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
  },
};
