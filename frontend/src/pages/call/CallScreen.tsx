import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useWebRTC } from '../../hooks/useWebRTC';
import { CallType } from '../../types/calls';

// Renders a single video element and attaches the stream imperatively
const VideoTile: React.FC<{
  stream: MediaStream | null;
  muted?: boolean;
  label?: string;
  className?: string;
}> = ({ stream, muted = false, label, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-gray-900 ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="w-full h-full object-cover"
      />
      {label && (
        <span className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded-full">
          {label}
        </span>
      )}
    </div>
  );
};

const ConnectionDot: React.FC<{ state: RTCPeerConnectionState | undefined }> = ({ state }) => {
  const colorMap: Record<string, string> = {
    connected: 'bg-green-400',
    connecting: 'bg-yellow-400 animate-pulse',
    disconnected: 'bg-red-400',
    failed: 'bg-red-600',
    closed: 'bg-gray-400',
    new: 'bg-blue-400',
  };
  const color = state ? colorMap[state] ?? 'bg-gray-400' : 'bg-gray-400';
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
};

// Mounting an audio element is required for remote audio tracks to be audible.
const RemoteAudio: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.srcObject = stream;
      void audioRef.current.play().catch(() => {
        // Browser autoplay policy can block playback until a user gesture.
      });
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay playsInline />;
};

const CallScreen: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const callType = (searchParams.get('type') as CallType) ?? 'video';

  const {
    localStream,
    remoteStreams,
    isMuted,
    isCameraOff,
    mediaWarning,
    connectionStates,
    toggleMic,
    toggleCamera,
    hangUp,
    room,
  } = useWebRTC({
    roomId: roomId ?? '',
    userId: user?.id ?? '',
    callType,
    onEnded: () => navigate(-1),
  });

  const totalParticipants = remoteStreams.length + 1;
  const primaryRemote = remoteStreams[0];
  const primaryRemoteState = primaryRemote ? connectionStates[primaryRemote.userId] : undefined;
  const hasConnectedRemote = remoteStreams.some(
    ({ userId: pid }) => connectionStates[pid] === 'connected'
  );
  const [isSwapped, setIsSwapped] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const pipRef = useRef<HTMLDivElement>(null);
  const [pipPosition, setPipPosition] = useState<{ x: number; y: number } | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const lastTapAtRef = useRef(0);
  const canSwapRef = useRef(false);

  useEffect(() => {
    canSwapRef.current = Boolean(callType === 'video' && localStream && primaryRemote);
  }, [callType, localStream, primaryRemote]);

  useEffect(() => {
    if (!localStream || !primaryRemote || callType !== 'video') {
      setIsSwapped(false);
    }
  }, [localStream, primaryRemote, callType]);

  useEffect(() => {
    if (!localStream || !primaryRemote || callType !== 'video') {
      setPipPosition(null);
      return;
    }

    if (pipPosition) return;

    const stageEl = stageRef.current;
    const pipEl = pipRef.current;
    if (!stageEl || !pipEl) return;

    const stageRect = stageEl.getBoundingClientRect();
    const pipRect = pipEl.getBoundingClientRect();
    const margin = 12;

    setPipPosition({
      x: Math.max(margin, stageRect.width - pipRect.width - margin),
      y: Math.max(margin, stageRect.height - pipRect.height - margin),
    });
  }, [localStream, primaryRemote, callType, pipPosition]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragStateRef.current;
      const stageEl = stageRef.current;
      const pipEl = pipRef.current;
      if (!drag || !stageEl || !pipEl) return;
      if (event.pointerId !== drag.pointerId) return;

      if (
        Math.abs(event.clientX - drag.startX) > 6 ||
        Math.abs(event.clientY - drag.startY) > 6
      ) {
        drag.moved = true;
      }

      const stageRect = stageEl.getBoundingClientRect();
      const pipRect = pipEl.getBoundingClientRect();
      const margin = 12;

      const maxX = Math.max(margin, stageRect.width - pipRect.width - margin);
      const maxY = Math.max(margin, stageRect.height - pipRect.height - margin);

      const rawX = event.clientX - stageRect.left - drag.offsetX;
      const rawY = event.clientY - stageRect.top - drag.offsetY;

      const x = Math.min(maxX, Math.max(margin, rawX));
      const y = Math.min(maxY, Math.max(margin, rawY));

      setPipPosition({ x, y });
    };

    const handlePointerUp = (event: PointerEvent) => {
      const drag = dragStateRef.current;
      if (!drag) return;
      if (event.pointerId !== drag.pointerId) return;

      if (!drag.moved && canSwapRef.current) {
        const now = Date.now();
        if (now - lastTapAtRef.current < 280) {
          setIsSwapped((prev) => !prev);
          lastTapAtRef.current = 0;
        } else {
          lastTapAtRef.current = now;
        }
      }

      dragStateRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const handlePipPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const stageEl = stageRef.current;
    const pipEl = pipRef.current;
    if (!stageEl || !pipEl) return;

    const stageRect = stageEl.getBoundingClientRect();
    const pipRect = pipEl.getBoundingClientRect();

    dragStateRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - pipRect.left,
      offsetY: event.clientY - pipRect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };

    const margin = 12;
    const maxX = Math.max(margin, stageRect.width - pipRect.width - margin);
    const maxY = Math.max(margin, stageRect.height - pipRect.height - margin);
    const rawX = event.clientX - stageRect.left - dragStateRef.current.offsetX;
    const rawY = event.clientY - stageRect.top - dragStateRef.current.offsetY;

    setPipPosition({
      x: Math.min(maxX, Math.max(margin, rawX)),
      y: Math.min(maxY, Math.max(margin, rawY)),
    });

    pipEl.setPointerCapture(event.pointerId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Hidden audio sinks for remote participants (needed for audio-only calls) */}
      <div className="hidden">
        {remoteStreams.map(({ userId: pid, stream }) => (
          <RemoteAudio key={`audio-${pid}`} stream={stream} />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {callType === 'video' ? '📹' : '🎙️'} {callType === 'video' ? 'Video' : 'Audio'} Call
          </span>
          {room && (
            <span className="text-xs text-gray-400">
              · {room.status}
            </span>
          )}
        </div>
        {/* Participant list */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>👥 {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {mediaWarning && (
        <div className="mx-3 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
          {mediaWarning}
        </div>
      )}

      {/* Video stage */}
      <div className="relative flex-1 p-3" ref={stageRef}>
        {callType === 'video' ? (
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
            {primaryRemote ? (
              <>
                {isSwapped && localStream ? (
                  <VideoTile
                    stream={localStream}
                    muted
                    label={`${user?.username ?? 'You'} (You)`}
                    className="w-full h-full rounded-none"
                  />
                ) : (
                  <>
                    <VideoTile
                      stream={primaryRemote.stream}
                      label={primaryRemote.userId}
                      className="w-full h-full rounded-none"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full text-xs">
                      <ConnectionDot state={primaryRemoteState} />
                      <span>{primaryRemoteState ?? 'connecting'}</span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
                <div className="text-center text-gray-300">
                  <div className="text-4xl mb-2">📹</div>
                  <p className="text-sm">Waiting for the other person to connect...</p>
                </div>
              </div>
            )}

            {/* Local PiP preview after remote is connected */}
            {localStream && primaryRemote && (
              <div
                ref={pipRef}
                onPointerDown={handlePipPointerDown}
                className="absolute w-28 h-40 sm:w-36 sm:h-52 rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-gray-900 cursor-grab active:cursor-grabbing touch-none"
                style={
                  pipPosition
                    ? { left: `${pipPosition.x}px`, top: `${pipPosition.y}px` }
                    : { right: '12px', bottom: '12px' }
                }
              >
                <VideoTile
                  stream={isSwapped ? primaryRemote.stream : localStream}
                  muted={!isSwapped}
                  label={isSwapped ? primaryRemote.userId : `${user?.username ?? 'You'} (You)`}
                  className="w-full h-full rounded-none"
                />
              </div>
            )}

            {/* Before connection, show local video in full area so user can preview camera */}
            {localStream && !primaryRemote && (
              <VideoTile
                stream={localStream}
                muted
                label={`${user?.username ?? 'You'} (You)`}
                className="absolute inset-0 w-full h-full rounded-none"
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full rounded-2xl bg-gray-900 border border-gray-800 flex flex-col items-center justify-center gap-4">
            <div className="w-28 h-28 rounded-full bg-blue-500/80 flex items-center justify-center text-5xl shadow-lg">
              {primaryRemote?.userId?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="text-sm text-gray-300">
              {primaryRemote ? primaryRemote.userId : 'Connecting...'}
            </div>
            <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full text-xs">
              <ConnectionDot state={primaryRemoteState} />
              <span>{primaryRemoteState ?? 'connecting'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Audio-only avatars when camera is off or audio call */}
      {(callType === 'audio' || (isCameraOff && hasConnectedRemote)) && localStream && (
        <div className="flex justify-center py-4">
          <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-4xl shadow-lg">
            {user?.username?.[0]?.toUpperCase() ?? '?'}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-5 bg-gray-900">
        {/* Mic */}
        <button
          onClick={toggleMic}
          title={isMuted ? 'Unmute' : 'Mute'}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors
            ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {isMuted ? '🔇' : '🎙️'}
        </button>

        {/* Camera (only for video calls) */}
        {callType === 'video' && (
          <button
            onClick={toggleCamera}
            title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors
              ${isCameraOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {isCameraOff ? '🚫' : '📹'}
          </button>
        )}

        {/* End call */}
        <button
          onClick={hangUp}
          title="End call"
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-2xl transition-colors shadow-lg"
        >
          📵
        </button>
      </div>
    </div>
  );
};

export default CallScreen;
