import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { CallRoom, CallSignal, CallStatus, CallType } from '../types/calls';

const ROOMS = 'callRooms';
const SIGNALS = 'signals';

// ─── helpers ────────────────────────────────────────────────────────────────

function assertFirebase(): void {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Please set the REACT_APP_FIREBASE_* env vars.');
  }
}

function toCallRoom(id: string, data: Record<string, unknown>): CallRoom {
  const ts = (v: unknown) =>
    v instanceof Timestamp ? v.toDate().toISOString() : (v as string) ?? '';
  return {
    id,
    appointmentId: data.appointmentId as string,
    createdAt: ts(data.createdAt),
    scheduledFor: ts(data.scheduledFor),
    status: data.status as CallStatus,
    hostUserId: data.hostUserId as string,
    participantUserIds: (data.participantUserIds as string[]) ?? [],
    type: data.type as CallType,
  };
}

// ─── room management ────────────────────────────────────────────────────────

/** Create or get the call room for a consultation/appointment */
export async function getOrCreateCallRoom(
  appointmentId: string,
  hostUserId: string,
  participantUserIds: string[],
  scheduledFor: string,
  type: CallType = 'video'
): Promise<CallRoom> {
  assertFirebase();
  const roomId = `appt-${appointmentId}`;
  const roomRef = doc(db, ROOMS, roomId);
  const snap = await getDoc(roomRef);

  if (snap.exists()) {
    return toCallRoom(snap.id, snap.data() as Record<string, unknown>);
  }

  const data = {
    appointmentId,
    createdAt: serverTimestamp(),
    scheduledFor,
    status: 'scheduled' as CallStatus,
    hostUserId,
    participantUserIds,
    type,
  };
  await setDoc(roomRef, data);
  return toCallRoom(roomId, { ...data, createdAt: new Date().toISOString() });
}

export async function updateRoomStatus(roomId: string, status: CallStatus): Promise<void> {
  assertFirebase();
  await updateDoc(doc(db, ROOMS, roomId), { status });
}

export async function getRoomById(roomId: string): Promise<CallRoom | null> {
  assertFirebase();
  const snap = await getDoc(doc(db, ROOMS, roomId));
  if (!snap.exists()) return null;
  return toCallRoom(snap.id, snap.data() as Record<string, unknown>);
}

export function subscribeToRoom(
  roomId: string,
  onChange: (room: CallRoom) => void
): Unsubscribe {
  assertFirebase();
  return onSnapshot(doc(db, ROOMS, roomId), (snap) => {
    if (snap.exists()) {
      onChange(toCallRoom(snap.id, snap.data() as Record<string, unknown>));
    }
  });
}

// ─── signaling ───────────────────────────────────────────────────────────────

export async function sendSignal(roomId: string, signal: Omit<CallSignal, 'id'>): Promise<void> {
  assertFirebase();
  await addDoc(collection(db, ROOMS, roomId, SIGNALS), {
    ...signal,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToSignals(
  roomId: string,
  onSignal: (signal: CallSignal) => void
): Unsubscribe {
  assertFirebase();
  const q = query(
    collection(db, ROOMS, roomId, SIGNALS),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    snap.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const data = change.doc.data();
        const ts = (v: unknown) =>
          v instanceof Timestamp ? v.toDate().toISOString() : (v as string) ?? '';
        onSignal({
          id: change.doc.id,
          from: data.from as string,
          to: data.to as string | undefined,
          type: data.type as CallSignal['type'],
          payload: data.payload,
          createdAt: ts(data.createdAt),
        });
      }
    });
  });
}
