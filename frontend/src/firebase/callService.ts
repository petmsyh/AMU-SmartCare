import api from '../api/axios';
import { CallRoom, CallSignal, CallStatus, CallType } from '../types/calls';

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

function toCallRoom(room: Record<string, unknown>): CallRoom {
  return {
    id: String(room.id ?? ''),
    appointmentId: String(room.consultationId ?? room.appointmentId ?? ''),
    createdAt: String(room.createdAt ?? ''),
    scheduledFor: room.scheduledFor ? new Date(String(room.scheduledFor)).toISOString() : '',
    status: String(room.status ?? 'scheduled') as CallStatus,
    hostUserId: String(room.hostUserId ?? ''),
    participantUserIds: (room.participantUserIds as string[]) ?? [],
    type: String(room.type ?? 'video') as CallType,
  };
}

function toCallSignal(signal: Record<string, unknown>): CallSignal {
  return {
    id: String(signal.id ?? ''),
    from: String(signal.fromUserId ?? signal.from ?? ''),
    to: signal.toUserId ? String(signal.toUserId) : undefined,
    type: String(signal.type) as CallSignal['type'],
    payload: signal.payload,
    createdAt: String(signal.createdAt ?? ''),
  };
}

function consultationIdFromRoomOrConsultationId(value: string): string {
  return value.startsWith('appt-') ? value.slice(5) : value;
}

function roomIdFromConsultationId(consultationId: string): string {
  return `appt-${consultationIdFromRoomOrConsultationId(consultationId)}`;
}

const LOCAL_ROOM_PREFIX = 'amu-smartcare:call-room:';
const LOCAL_SIGNAL_PREFIX = 'amu-smartcare:call-signal:';
const LOCAL_CHANNEL_PREFIX = 'amu-smartcare:call-channel:';

function canUseBrowserStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function localRoomKey(roomId: string): string {
  return `${LOCAL_ROOM_PREFIX}${roomId}`;
}

function localSignalKey(roomId: string, signalId: string): string {
  return `${LOCAL_SIGNAL_PREFIX}${roomId}:${signalId}`;
}

function isSignalStorageKeyForRoom(key: string, roomId: string): boolean {
  return key.startsWith(`${LOCAL_SIGNAL_PREFIX}${roomId}:`);
}

function getBroadcastChannel(roomId: string): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null;
  return new BroadcastChannel(`${LOCAL_CHANNEL_PREFIX}${roomId}`);
}

function persistLocalRoom(room: CallRoom): void {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(localRoomKey(room.id), JSON.stringify(room));
}

function readLocalRoom(roomId: string): CallRoom | null {
  if (!canUseBrowserStorage()) return null;
  return safeJsonParse<CallRoom>(window.localStorage.getItem(localRoomKey(roomId)));
}

function emitLocalRoom(room: CallRoom): void {
  persistLocalRoom(room);
  const channel = getBroadcastChannel(room.id);
  channel?.postMessage({ type: 'room', room });
  channel?.close();
}

function persistLocalSignal(roomId: string, signal: CallSignal): void {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(localSignalKey(roomId, signal.id ?? ''), JSON.stringify(signal));
  const channel = getBroadcastChannel(roomId);
  channel?.postMessage({ type: 'signal', signal });
  channel?.close();
}

function getLocalSignals(roomId: string): CallSignal[] {
  if (!canUseBrowserStorage()) return [];
  const signals: CallSignal[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || !isSignalStorageKeyForRoom(key, roomId)) continue;
    const signal = safeJsonParse<CallSignal>(window.localStorage.getItem(key));
    if (signal) signals.push(signal);
  }
  signals.sort((left, right) => (left.createdAt || '').localeCompare(right.createdAt || ''));
  return signals;
}

export function clearLocalCallSignalCache(roomId: string): void {
  if (!canUseBrowserStorage()) return;

  const keysToDelete: string[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || !isSignalStorageKeyForRoom(key, roomId)) continue;
    keysToDelete.push(key);
  }

  keysToDelete.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

function createSignalId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `signal-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeRoomResponse(response: ApiEnvelope<Record<string, unknown>>): CallRoom {
  return toCallRoom(response.data);
}

function normalizeSignalResponse(response: ApiEnvelope<Record<string, unknown>[]>): CallSignal[] {
  return response.data.map(toCallSignal);
}

function getHttpStatus(error: unknown): number | undefined {
  return (error as { response?: { status?: number } })?.response?.status;
}

/** Create or get the call room for a consultation/appointment */
export async function getOrCreateCallRoom(
  consultationId: string,
  hostUserId: string,
  participantUserIds: string[],
  scheduledFor: string,
  type: CallType = 'video'
): Promise<CallRoom> {
  const normalizedConsultationId = consultationIdFromRoomOrConsultationId(consultationId);
  const provisionalRoom: CallRoom = {
    id: roomIdFromConsultationId(normalizedConsultationId),
    appointmentId: normalizedConsultationId,
    createdAt: new Date().toISOString(),
    scheduledFor,
    status: 'scheduled',
    hostUserId,
    participantUserIds,
    type,
  };

  const existingRoom = readLocalRoom(provisionalRoom.id);
  if (existingRoom) {
    return existingRoom;
  }

  emitLocalRoom(provisionalRoom);

  try {
    const response = await api.post<ApiEnvelope<Record<string, unknown>>>(
      `/calls/rooms/${normalizedConsultationId}`,
      {
        scheduledFor,
        type,
      }
    );
    const room = normalizeRoomResponse(response.data);
    emitLocalRoom(room);
    return room;
  } catch (error) {
    if (getHttpStatus(error) === 404) {
      // Backend room lookup is unavailable for this consultation; keep the local room so the
      // call can proceed without polluting the console with repeated 404s.
      return provisionalRoom;
    }

    throw error;
  }
}

export async function updateRoomStatus(roomId: string, status: CallStatus): Promise<void> {
  const currentRoom = readLocalRoom(roomId);
  if (currentRoom) {
    emitLocalRoom({ ...currentRoom, status });
  }
  try {
    await api.patch(`/calls/rooms/${roomId}`, { status });
  } catch {
    // Ignore backend update failures for local call continuity.
  }
}

export async function getRoomById(roomId: string): Promise<CallRoom | null> {
  try {
    const response = await api.get<ApiEnvelope<Record<string, unknown>>>(`/calls/rooms/${roomId}`);
    return normalizeRoomResponse(response.data);
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) return null;
    throw error;
  }
}

export function subscribeToRoom(
  roomId: string,
  onChange: (room: CallRoom) => void
): () => void {
  let disposed = false;
  let lastSignature = '';
  let nextRoomLookupAt = 0;
  // Local storage is only an optimistic cache; backend polling must stay on so
  // different browsers/devices can observe the same room state.
  const shouldPollBackend = true;

  const initialRoom = readLocalRoom(roomId);
  if (initialRoom) {
    lastSignature = `${initialRoom.id}:${initialRoom.status}:${initialRoom.createdAt}:${initialRoom.scheduledFor}`;
    onChange(initialRoom);
  }

  const localChannel = getBroadcastChannel(roomId);
  const handleLocalMessage = (event: MessageEvent) => {
    const message = event.data as { type?: string; room?: CallRoom } | undefined;
    if (message?.type !== 'room' || !message.room) return;
    const signature = `${message.room.id}:${message.room.status}:${message.room.createdAt}:${message.room.scheduledFor}`;
    if (signature === lastSignature) return;
    lastSignature = signature;
    onChange(message.room);
  };
  localChannel?.addEventListener('message', handleLocalMessage);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== localRoomKey(roomId) || !event.newValue) return;
    const room = safeJsonParse<CallRoom>(event.newValue);
    if (!room) return;
    const signature = `${room.id}:${room.status}:${room.createdAt}:${room.scheduledFor}`;
    if (signature === lastSignature) return;
    lastSignature = signature;
    onChange(room);
  };
  window.addEventListener('storage', handleStorage);

  const poll = async () => {
    if (disposed) return;
    if (!shouldPollBackend) return;
    const now = Date.now();
    if (now < nextRoomLookupAt) return;
    try {
      const room = await getRoomById(roomId);
      if (!room) {
        // Avoid hammering an endpoint when the room is not created yet.
        nextRoomLookupAt = now + 10000;
        return;
      }
      nextRoomLookupAt = 0;
      const signature = `${room.id}:${room.status}:${room.createdAt}:${room.scheduledFor}`;
      if (signature === lastSignature) return;
      lastSignature = signature;
      onChange(room);
    } catch (error) {
      const status = getHttpStatus(error);
      if (status === 404 || status === 429) {
        nextRoomLookupAt = now + 10000;
        return;
      }

      // Slow down repeated retries on transient API failures.
      nextRoomLookupAt = now + 5000;
    }
  };

  void poll();
  const intervalId = window.setInterval(() => {
    void poll();
  }, 1000);

  return () => {
    disposed = true;
    window.clearInterval(intervalId);
    localChannel?.removeEventListener('message', handleLocalMessage);
    localChannel?.close();
    window.removeEventListener('storage', handleStorage);
  };
}

export async function sendSignal(roomId: string, signal: Omit<CallSignal, 'id'>): Promise<void> {
  const signalId = createSignalId();
  const fullSignal: CallSignal = { ...signal, id: signalId };
  persistLocalSignal(roomId, fullSignal);

  try {
    await api.post(`/calls/rooms/${roomId}/signals`, {
      toUserId: signal.to ?? null,
      type: signal.type,
      payload: signal.payload,
    });
  } catch {
    // Ignore backend signal failures; local transport already emitted.
  }
}

export function subscribeToSignals(
  roomId: string,
  onSignal: (signal: CallSignal) => void
): () => void {
  let disposed = false;
  const seenIds = new Set<string>();
  let backendRoomKnown = false;
  let nextRoomLookupAt = 0;
  const subscriptionStartedAtMs = Date.now();
  const bootstrapWindowMs = 5000;
  let lastSeenCreatedAt = new Date(subscriptionStartedAtMs - bootstrapWindowMs).toISOString();

  const isRelevantForCurrentSubscription = (signal: CallSignal): boolean => {
    const createdAtMs = Date.parse(signal.createdAt ?? '');
    if (Number.isNaN(createdAtMs)) return true;
    return createdAtMs >= subscriptionStartedAtMs - bootstrapWindowMs;
  };

  const emitSignal = (signal: CallSignal) => {
    if (!signal.id || seenIds.has(signal.id)) return;
    if (!isRelevantForCurrentSubscription(signal)) return;
    seenIds.add(signal.id);
    if ((signal.createdAt || '') > lastSeenCreatedAt) {
      lastSeenCreatedAt = signal.createdAt;
    }
    onSignal(signal);
  };

  getLocalSignals(roomId).forEach(emitSignal);

  const localChannel = getBroadcastChannel(roomId);
  const handleLocalMessage = (event: MessageEvent) => {
    const message = event.data as { type?: string; signal?: CallSignal } | undefined;
    if (message?.type !== 'signal' || !message.signal) return;
    emitSignal(message.signal);
  };
  localChannel?.addEventListener('message', handleLocalMessage);

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || !isSignalStorageKeyForRoom(event.key, roomId) || !event.newValue) return;
    const signal = safeJsonParse<CallSignal>(event.newValue);
    if (signal) emitSignal(signal);
  };
  window.addEventListener('storage', handleStorage);

  const poll = async () => {
    if (disposed) return;
    const now = Date.now();
    if (now < nextRoomLookupAt) return;
    try {
      if (!backendRoomKnown) {
        const room = await getRoomById(roomId);
        if (!room) {
          // Back off when room does not exist yet to reduce repeated 404s.
          nextRoomLookupAt = now + 10000;
          return;
        }
        backendRoomKnown = true;
        nextRoomLookupAt = 0;
      }

      const response = await api.get<ApiEnvelope<Record<string, unknown>[]>>(`/calls/rooms/${roomId}/signals`, {
        params: {
          after: lastSeenCreatedAt,
        },
      });
      const signals = normalizeSignalResponse(response.data);
      for (const signal of signals) {
        emitSignal(signal);
      }
    } catch (error) {
      const status = getHttpStatus(error);
      if (status === 404 || status === 429) {
        nextRoomLookupAt = now + 10000;
        return;
      }

      // Slow down repeated retries on transient API failures.
      nextRoomLookupAt = now + 5000;
    }
  };

  void poll();
  const intervalId = window.setInterval(() => {
    void poll();
  }, 2500);

  return () => {
    disposed = true;
    window.clearInterval(intervalId);
    localChannel?.removeEventListener('message', handleLocalMessage);
    localChannel?.close();
    window.removeEventListener('storage', handleStorage);
  };
}
