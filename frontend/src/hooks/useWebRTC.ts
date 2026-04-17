import { useCallback, useEffect, useRef, useState } from 'react';
import { CallRoom, CallSignal, CallType } from '../types/calls';
import {
  clearLocalCallSignalCache,
  getOrCreateCallRoom,
  sendSignal,
  subscribeToSignals,
  subscribeToRoom,
  updateRoomStatus,
} from '../firebase/callService';

function parseCsv(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildIceConfig(): RTCConfiguration {
  const stunUrls = parseCsv(process.env.REACT_APP_STUN_URLS);
  const turnUrls = parseCsv(process.env.REACT_APP_TURN_URLS);
  const turnUsername = process.env.REACT_APP_TURN_USERNAME?.trim();
  const turnCredential = process.env.REACT_APP_TURN_CREDENTIAL?.trim();

  const iceServers: RTCIceServer[] = [];

  if (stunUrls.length > 0) {
    iceServers.push({ urls: stunUrls });
  } else {
    // Safe fallback for development.
    iceServers.push({ urls: ['stun:stun.l.google.com:19302'] });
  }

  if (turnUrls.length > 0) {
    if (turnUsername && turnCredential) {
      iceServers.push({
        urls: turnUrls,
        username: turnUsername,
        credential: turnCredential,
      });
    } else {
      // Some TURN providers support anonymous relay.
      iceServers.push({ urls: turnUrls });
    }
  }

  return {
    iceServers,
    iceCandidatePoolSize: 10,
  };
}

const ICE_CONFIG: RTCConfiguration = buildIceConfig();

const MAX_SIGNAL_AGE_MS = 2 * 60 * 1000;

export interface RemoteStream {
  userId: string;
  stream: MediaStream;
}

export interface UseWebRTCOptions {
  roomId: string;
  userId: string;
  callType: CallType;
  onEnded?: () => void;
}

export interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  isMuted: boolean;
  isCameraOff: boolean;
  mediaWarning: string;
  connectionStates: Record<string, RTCPeerConnectionState>;
  toggleMic: () => void;
  toggleCamera: () => void;
  hangUp: () => Promise<void>;
  room: CallRoom | null;
}

export function useWebRTC({
  roomId,
  userId,
  callType,
  onEnded,
}: UseWebRTCOptions): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [mediaWarning, setMediaWarning] = useState('');
  const [room, setRoom] = useState<CallRoom | null>(null);
  const [connectionStates, setConnectionStates] = useState<
    Record<string, RTCPeerConnectionState>
  >({});

  // Map from remoteUserId -> RTCPeerConnection
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  // Map from remoteUserId -> ICE candidates received before remote description is ready
  const pendingIceRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  // Track which offers we've already processed
  const processedSignalsRef = useRef<Set<string>>(new Set());
  const hungUpRef = useRef(false);
  const sessionStartedAtRef = useRef<number>(0);

  // ── helpers ─────────────────────────────────────────────────────────────

  const updateConnectionState = useCallback(
    (peerId: string, state: RTCPeerConnectionState) => {
      setConnectionStates((prev) => ({ ...prev, [peerId]: state }));
    },
    []
  );

  const createPeerConnection = useCallback(
    (peerId: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection(ICE_CONFIG);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal(roomId, {
            from: userId,
            to: peerId,
            type: 'ice',
            payload: event.candidate.toJSON(),
            createdAt: new Date().toISOString(),
          }).catch(() => {});
        }
      };

      pc.onconnectionstatechange = () => {
        updateConnectionState(peerId, pc.connectionState);
      };

      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStreams((prev) => {
          const existing = prev.find((r) => r.userId === peerId);
          if (existing) {
            return prev.map((r) =>
              r.userId === peerId ? { ...r, stream: remoteStream } : r
            );
          }
          return [...prev, { userId: peerId, stream: remoteStream }];
        });
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      pcsRef.current.set(peerId, pc);
      return pc;
    },
    [roomId, userId, updateConnectionState]
  );

  const acquireMediaStream = useCallback(async (): Promise<MediaStream> => {
    const preferredConstraints: MediaStreamConstraints = {
      audio: true,
      video: callType === 'video',
    };

    try {
      return await navigator.mediaDevices.getUserMedia(preferredConstraints);
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'NotFoundError') {
        throw error;
      }

      // If the requested device is missing, fall back to a receive-only style
      // stream so the call screen can still open instead of failing hard.
      if (callType === 'audio') {
        setMediaWarning('No microphone was found. Joining without local audio.');
        return new MediaStream();
      }

      setMediaWarning('No camera was found. Joining with audio only.');
      return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }
  }, [callType]);

  // ── initiate offer to a new peer ─────────────────────────────────────────

  const initiateOffer = useCallback(
    async (peerId: string) => {
      const pc = createPeerConnection(peerId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await sendSignal(roomId, {
        from: userId,
        to: peerId,
        type: 'offer',
        payload: offer,
        createdAt: new Date().toISOString(),
      });
    },
    [createPeerConnection, roomId, userId]
  );

  const queueIceCandidate = useCallback((peerId: string, candidate: RTCIceCandidateInit) => {
    const current = pendingIceRef.current.get(peerId) ?? [];
    current.push(candidate);
    pendingIceRef.current.set(peerId, current);
  }, []);

  const flushPendingIceCandidates = useCallback(async (peerId: string, pc: RTCPeerConnection) => {
    const pending = pendingIceRef.current.get(peerId);
    if (!pending || pending.length === 0) return;
    if (!pc.remoteDescription) return;

    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (_) {
        // Ignore invalid/stale candidates.
      }
    }

    pendingIceRef.current.delete(peerId);
  }, []);

  // ── handle incoming signal ───────────────────────────────────────────────

  const handleSignal = useCallback(
    async (signal: CallSignal) => {
      const createdAtMs = Date.parse(signal.createdAt ?? '');
      if (!Number.isNaN(createdAtMs) && Date.now() - createdAtMs > MAX_SIGNAL_AGE_MS) {
        return;
      }

      if (!signal.id) return;
      if (processedSignalsRef.current.has(signal.id)) return;
      processedSignalsRef.current.add(signal.id);

      // Ignore stale hangup events from a previous call attempt in the same room.
      if (
        signal.type === 'hangup' &&
        !Number.isNaN(createdAtMs) &&
        sessionStartedAtRef.current > 0 &&
        createdAtMs < sessionStartedAtRef.current
      ) {
        return;
      }

      // Ignore signals not targeted at this user (except broadcasts with no `to`)
      if (signal.to && signal.to !== userId) return;
      // Ignore signals from self
      if (signal.from === userId) return;

      if (signal.type === 'hangup') {
        // Remove remote peer
        const pc = pcsRef.current.get(signal.from);
        if (pc) {
          pc.close();
          pcsRef.current.delete(signal.from);
        }
        setRemoteStreams((prev) => prev.filter((r) => r.userId !== signal.from));
        setConnectionStates((prev) => {
          const next = { ...prev };
          delete next[signal.from];
          return next;
        });
        return;
      }

      let pc = pcsRef.current.get(signal.from);

      if (signal.type === 'offer') {
        if (!pc) pc = createPeerConnection(signal.from);
        await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
        await flushPendingIceCandidates(signal.from, pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await sendSignal(roomId, {
          from: userId,
          to: signal.from,
          type: 'answer',
          payload: answer,
          createdAt: new Date().toISOString(),
        });
      } else if (signal.type === 'answer') {
        if (pc && pc.signalingState !== 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
          await flushPendingIceCandidates(signal.from, pc);
        }
      } else if (signal.type === 'ice') {
        const candidateInit = signal.payload as RTCIceCandidateInit;
        if (pc) {
          if (pc.remoteDescription) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidateInit));
            } catch (_) {
              // Ignore stale ICE candidates
            }
          } else {
            queueIceCandidate(signal.from, candidateInit);
          }
        } else {
          queueIceCandidate(signal.from, candidateInit);
        }
      }
    },
    [userId, roomId, createPeerConnection, flushPendingIceCandidates, queueIceCandidate]
  );

  // ── main effect: acquire media, subscribe to room + signals ───────────────

  useEffect(() => {
    if (!roomId || !userId) return;

    let unsubRoom: (() => void) | undefined;
    let unsubSignals: (() => void) | undefined;

    const init = async () => {
      try {
        hungUpRef.current = false;
        sessionStartedAtRef.current = Date.now();
        processedSignalsRef.current.clear();
        pendingIceRef.current.clear();
        setRemoteStreams([]);
        setConnectionStates({});

        // Drop stale local signals from previous call sessions for this room.
        clearLocalCallSignalCache(roomId);

        const stream = await acquireMediaStream();
        localStreamRef.current = stream;
        setLocalStream(stream);

        const consultationId = roomId.startsWith('appt-') ? roomId.slice(5) : roomId;
        await getOrCreateCallRoom(
          consultationId,
          userId,
          [],
          new Date().toISOString(),
          callType
        );

        unsubRoom = subscribeToRoom(roomId, (r) => {
          setRoom(r);
          if (r.status === 'ended' && !hungUpRef.current) {
            onEnded?.();
          }
        });

        unsubSignals = subscribeToSignals(roomId, handleSignal);

        // Update room status to in-progress when we join
        await updateRoomStatus(roomId, 'in_progress');

      } catch (err) {
        console.error('useWebRTC init error:', err);
        setMediaWarning(
          err instanceof Error
            ? err.message
            : 'Failed to access microphone or camera.'
        );
      }
    };

    init();

    const pcs = pcsRef.current;
    const pendingIce = pendingIceRef.current;
    const processedSignals = processedSignalsRef.current;

    return () => {
      unsubRoom?.();
      unsubSignals?.();

      // Ensure resources are released even when user leaves without pressing hang up.
      pcs.forEach((pc) => pc.close());
      pcs.clear();
      pendingIce.clear();
      processedSignals.clear();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId, callType]);

  // Send offers when room participant list changes
  useEffect(() => {
    if (!room) return;
    if (room.hostUserId !== userId) return;

    room.participantUserIds.forEach(async (pid) => {
      if (pid !== userId && !pcsRef.current.has(pid)) {
        await initiateOffer(pid);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.participantUserIds.join(',')]);

  // ── controls ─────────────────────────────────────────────────────────────

  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return;
    const enabled = !isMuted;
    localStreamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !enabled;
    });
    setIsMuted(enabled);
  }, [isMuted]);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current) return;
    const enabled = !isCameraOff;
    localStreamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !enabled;
    });
    setIsCameraOff(enabled);
  }, [isCameraOff]);

  const hangUp = useCallback(async () => {
    if (hungUpRef.current) return;
    hungUpRef.current = true;

    // Notify peers
    await sendSignal(roomId, {
      from: userId,
      type: 'hangup',
      payload: null,
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    // Close all peer connections
    pcsRef.current.forEach((pc) => pc.close());
    pcsRef.current.clear();

    // Stop local tracks
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);

    // Mark room ended if we are the only participant or if we want to close the room
    await updateRoomStatus(roomId, 'ended').catch(() => {});

    onEnded?.();
  }, [roomId, userId, onEnded]);

  return {
    localStream,
    remoteStreams,
    isMuted,
    isCameraOff,
    connectionStates,
    mediaWarning,
    toggleMic,
    toggleCamera,
    hangUp,
    room,
  };
}
