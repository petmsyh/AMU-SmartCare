import React, { useEffect, useRef } from 'react';
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

  const totalParticipants = remoteStreams.length + 1; // +1 for local
  const gridCols =
    totalParticipants <= 1
      ? 'grid-cols-1'
      : totalParticipants <= 4
      ? 'grid-cols-2'
      : 'grid-cols-3';

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
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

      {/* Video grid */}
      <div className={`flex-1 grid ${gridCols} gap-2 p-3`}>
        {/* Local stream */}
        <VideoTile
          stream={localStream}
          muted
          label={`${user?.username ?? 'You'} (You)`}
          className={callType === 'audio' ? 'flex items-center justify-center' : 'aspect-video'}
        />
        {/* Remote streams */}
        {remoteStreams.map(({ userId: pid, stream }) => (
          <div key={pid} className="relative">
            <VideoTile
              stream={stream}
              label={pid}
              className={callType === 'audio' ? 'flex items-center justify-center' : 'aspect-video'}
            />
            {/* Connection state indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full text-xs">
              <ConnectionDot state={connectionStates[pid]} />
              <span>{connectionStates[pid] ?? 'connecting'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Audio-only avatars when camera is off or audio call */}
      {(callType === 'audio' || isCameraOff) && localStream && (
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
