import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getOrCreateCallRoom, sendSignal, updateRoomStatus } from '../firebase/callService';
import { CallType } from '../types/calls';

interface JoinCallButtonProps {
  /** The consultation/appointment ID – used as Firestore room key prefix */
  appointmentId: string;
  scheduledAt: string | undefined;
  hostUserId: string;
  participantUserIds: string[];
  /** Default call type shown on the button */
  defaultCallType?: CallType;
  /** Extra Tailwind classes */
  className?: string;
  /** Render minimal icon-only controls for compact places like chat header */
  compact?: boolean;
}

const LoadingIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5 animate-spin"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
  </svg>
);

const AudioIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

const VideoIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="6" width="14" height="12" rx="2" />
    <polygon points="17 10 21 8 21 16 17 14" />
  </svg>
);

/**
 * Shows an audio/video join-call pair of buttons.
 * Buttons are enabled only within the allowed window:
 *   [scheduledAt - 10 min, scheduledAt + 90 min]
 *
 * If Firebase is not configured the buttons are shown but clicking them
 * navigates to the call screen, which displays a "not configured" message.
 */
const JoinCallButton: React.FC<JoinCallButtonProps> = ({
  appointmentId,
  scheduledAt,
  hostUserId,
  participantUserIds,
  className = '',
  compact = false,
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<CallType | null>(null);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Time-window check
  const now = Date.now();
  const scheduled = scheduledAt ? new Date(scheduledAt).getTime() : null;
  const BEFORE_MS = 10 * 60 * 1000; // 10 min before
  const AFTER_MS = 90 * 60 * 1000;  // 90 min after (typical max consultation)
  const withinWindow =
    scheduled !== null && now >= scheduled - BEFORE_MS && now <= scheduled + AFTER_MS;
  const bypassCallWindow = process.env.REACT_APP_BYPASS_CALL_WINDOW === 'true';
  const canJoin = bypassCallWindow || withinWindow;

  const handleJoin = async (callType: CallType) => {
    if (!user) return;
    if (!isOnline) {
      setError('You are offline. Please connect to the internet and try again.');
      return;
    }
    setError('');
    setLoading(callType);
    const roomId = `appt-${appointmentId}`;

    // Navigate immediately so the user sees the call screen without waiting
    // for Firestore/network work to complete.
    navigate(`/call/${roomId}?type=${callType}`);

    void (async () => {
    try {
      const room = await getOrCreateCallRoom(
        appointmentId,
        hostUserId,
        participantUserIds,
        scheduledAt ?? new Date().toISOString(),
        callType
      );

      // Notify other participants with a ringing signal.
      await updateRoomStatus(room.id, 'ringing').catch(() => {});
      const receivers = participantUserIds.filter((pid) => pid !== user.id);
      await Promise.all(
        receivers.map((receiverId) =>
          sendSignal(room.id, {
            from: user.id,
            to: receiverId,
            type: 'ring',
            payload: {
              roomId: room.id,
              callType,
              appointmentId,
            },
            createdAt: new Date().toISOString(),
          }).catch(() => {})
        )
      );
    } catch (err: unknown) {
      console.error('Call setup failed:', err);
    } finally {
      setLoading(null);
    }
    })();
  };

  if (!scheduled) return null;

  const buttonGridClass = compact
    ? 'flex items-center gap-1.5'
    : 'grid grid-cols-1 sm:grid-cols-2 gap-2';

  const buttonClass = compact
    ? 'h-9 min-w-9 px-2.5 rounded-lg'
    : 'w-full px-4 py-2.5 rounded-xl';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {!compact && (
        <div className="text-xs">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-semibold
              ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
            />
            {isOnline ? 'Client is online' : 'Client is offline'}
          </span>
        </div>
      )}

      <div className={buttonGridClass}>
        <button
          onClick={() => handleJoin('audio')}
          disabled={!canJoin || loading !== null}
          aria-label={loading === 'audio' ? 'Joining audio call' : 'Start audio call'}
          title={loading === 'audio' ? 'Joining audio call' : 'Start audio call'}
          className={`${buttonClass} flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors
            ${canJoin && loading === null
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {loading === 'audio' ? <LoadingIcon /> : <AudioIcon />}
        </button>

        <button
          onClick={() => handleJoin('video')}
          disabled={!canJoin || loading !== null}
          aria-label={loading === 'video' ? 'Joining video call' : 'Start video call'}
          title={loading === 'video' ? 'Joining video call' : 'Start video call'}
          className={`${buttonClass} flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors
            ${canJoin && loading === null
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {loading === 'video' ? <LoadingIcon /> : <VideoIcon />}
        </button>
      </div>

      {!compact && !canJoin && (
        <p className="text-xs text-gray-500">
          Call available 10 min before scheduled time
          {scheduledAt
            ? ` (${new Date(scheduledAt).toLocaleString()})`
            : ''}
          .
        </p>
      )}

      {!compact && bypassCallWindow && (
        <p className="text-xs text-amber-600">
          Call window bypass is enabled for testing.
        </p>
      )}

      {!compact && error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default JoinCallButton;
