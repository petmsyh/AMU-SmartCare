import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getOrCreateCallRoom } from '../firebase/callService';
import { CallType } from '../types/calls';
import { isFirebaseConfigured } from '../firebase/config';

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
}

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
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<CallType | null>(null);
  const [error, setError] = useState('');

  // Time-window check
  const now = Date.now();
  const scheduled = scheduledAt ? new Date(scheduledAt).getTime() : null;
  const BEFORE_MS = 10 * 60 * 1000; // 10 min before
  const AFTER_MS = 90 * 60 * 1000;  // 90 min after (typical max consultation)
  const withinWindow =
    scheduled !== null && now >= scheduled - BEFORE_MS && now <= scheduled + AFTER_MS;

  const handleJoin = async (callType: CallType) => {
    if (!user) return;
    setError('');
    setLoading(callType);
    try {
      // Ensure the room exists in Firestore (or create it)
      if (isFirebaseConfigured) {
        const room = await getOrCreateCallRoom(
          appointmentId,
          hostUserId,
          participantUserIds,
          scheduledAt ?? new Date().toISOString(),
          callType
        );
        navigate(`/call/${room.id}?type=${callType}`);
      } else {
        // Firebase not configured – still navigate so the call screen shows the warning
        navigate(`/call/appt-${appointmentId}?type=${callType}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to join call');
    } finally {
      setLoading(null);
    }
  };

  if (!scheduled) return null;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleJoin('audio')}
          disabled={!withinWindow || loading !== null}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
            ${withinWindow && loading === null
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {loading === 'audio' ? '⏳' : '🎙️'}
          {loading === 'audio' ? 'Joining…' : 'Audio Call'}
        </button>

        <button
          onClick={() => handleJoin('video')}
          disabled={!withinWindow || loading !== null}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
            ${withinWindow && loading === null
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {loading === 'video' ? '⏳' : '📹'}
          {loading === 'video' ? 'Joining…' : 'Video Call'}
        </button>
      </div>

      {!withinWindow && (
        <p className="text-xs text-gray-500">
          Call available 10 min before scheduled time
          {scheduledAt
            ? ` (${new Date(scheduledAt).toLocaleString()})`
            : ''}
          .
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default JoinCallButton;
