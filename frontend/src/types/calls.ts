export type CallStatus = 'scheduled' | 'ringing' | 'in_progress' | 'ended';
export type CallType = 'audio' | 'video';
export type SignalType = 'ring' | 'offer' | 'answer' | 'ice' | 'hangup';

export interface CallRoom {
  id: string;
  appointmentId: string;
  createdAt: string;
  scheduledFor: string;
  status: CallStatus;
  hostUserId: string;
  participantUserIds: string[];
  type: CallType;
}

export interface CallSignal {
  id?: string;
  from: string;
  to?: string; // undefined = broadcast to all
  type: SignalType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  createdAt: string;
}
