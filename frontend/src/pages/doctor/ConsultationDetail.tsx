import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchConsultationById,
  confirmConsultation,
  updateConsultationStatus,
} from '../../store/slices/consultationsSlice';
import ChatWindow from '../../components/ChatWindow';
import JoinCallButton from '../../components/JoinCallButton';
import { subscribeToSignals } from '../../firebase/callService';
import { CallType } from '../../types/calls';

const MAX_RING_SIGNAL_AGE_MS = 45 * 1000;

function isFreshRing(createdAt?: string): boolean {
  if (!createdAt) return false;
  const createdAtMs = Date.parse(createdAt);
  if (Number.isNaN(createdAtMs)) return false;
  return Date.now() - createdAtMs <= MAX_RING_SIGNAL_AGE_MS;
}

const statusClasses: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  accepted: 'bg-success-100 text-success-700',
  declined: 'bg-danger-100 text-danger-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-100 text-gray-600',
  disputed: 'bg-pink-100 text-pink-700',
};

const DoctorConsultationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selected: consultation, loading, error } = useSelector((state: RootState) => state.consultations);
  const { user } = useSelector((state: RootState) => state.auth);
  const [confirming, setConfirming] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    roomId: string;
    from: string;
    type: CallType;
  } | null>(null);
  const seenSignalIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (id) dispatch(fetchConsultationById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!consultation || !user?.id) return;

    const roomId = `appt-${consultation.id}`;
    let unsub: (() => void) | undefined;

    try {
      unsub = subscribeToSignals(roomId, (signal) => {
        if (signal.type !== 'ring') return;
        if (!isFreshRing(signal.createdAt)) return;
        if (!signal.id || seenSignalIdsRef.current.has(signal.id)) return;
        if (signal.from === user.id) return;
        if (signal.to && signal.to !== user.id) return;

        seenSignalIdsRef.current.add(signal.id);
        const payload = (signal.payload as { roomId?: string; callType?: CallType }) ?? {};
        setIncomingCall({
          roomId: payload.roomId ?? roomId,
          from: signal.from,
          type: payload.callType === 'audio' ? 'audio' : 'video',
        });
      });
    } catch (_) {
      // Ignore signal subscription issues; call page will still be available.
    }

    return () => {
      unsub?.();
    };
  }, [consultation, user?.id]);

  const handleConfirm = async () => {
    if (!id) return;
    setConfirming(true);
    await dispatch(confirmConsultation(id));
    setConfirming(false);
    dispatch(fetchConsultationById(id));
  };

  const handleStatusUpdate = async (status: string) => {
    if (!id) return;
    await dispatch(updateConsultationStatus({ id, status }));
    dispatch(fetchConsultationById(id));
  };

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return (
    <div className="bg-danger-100 text-danger-700 px-3.5 py-2.5 rounded-md">
      {error}
    </div>
  );
  if (!consultation) return null;

  const isActive = ['accepted', 'in_progress'].includes(consultation.status);
  const isCompleted = consultation.status === 'completed';
  const doctorAlreadyConfirmed = consultation.doctorConfirmed;

  const badgeClass = statusClasses[consultation.status] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className="max-w-[700px]">
      <button
        onClick={() => navigate(-1)}
        className="bg-transparent border-0 text-primary-500 cursor-pointer text-sm mb-4 p-0"
      >
        ← Back to Consultations
      </button>

      <div className="card mb-4">
        {incomingCall && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="m-0 text-sm font-semibold text-blue-800">
                Incoming {incomingCall.type} call
              </p>
              <p className="m-0 text-xs text-blue-700">From: {incomingCall.from}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/call/${incomingCall.roomId}?type=${incomingCall.type}`)}
                className="px-3 py-1.5 rounded bg-success-500 text-white text-xs font-semibold"
              >
                Answer
              </button>
              <button
                onClick={() => setIncomingCall(null)}
                className="px-3 py-1.5 rounded bg-gray-200 text-gray-700 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="m-0 text-xl font-semibold">Consultation Detail</h2>
          <span className={`${badgeClass} px-3 py-1 rounded-full text-xs font-semibold capitalize`}>
            {consultation.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[
            { label: 'Patient', value: consultation.patient?.username || consultation.patientId },
            { label: 'Scheduled', value: consultation.scheduledAt ? new Date(consultation.scheduledAt).toLocaleString() : 'Not set' },
            { label: 'Patient Confirmed', value: consultation.patientConfirmed ? '✅ Yes' : '⏳ No' },
            { label: 'Doctor Confirmed', value: consultation.doctorConfirmed ? '✅ Yes' : '⏳ No' },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 px-3 py-2.5 rounded-md">
              <div className="text-[11px] text-gray-500 mb-0.5 font-semibold">{item.label}</div>
              <div className="text-[13px] font-medium">{item.value}</div>
            </div>
          ))}
        </div>

        {consultation.notes && (
          <div className="bg-gray-50 px-3 py-2.5 rounded-md mb-4">
            <div className="text-[11px] text-gray-500 mb-1 font-semibold">Patient Notes</div>
            <p className="m-0 text-[13px] text-gray-600">{consultation.notes}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {consultation.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate('accepted')}
                className="px-[18px] py-2 bg-success-500 text-white border-0 rounded cursor-pointer text-[13px] font-semibold"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate('declined')}
                className="btn btn-danger px-[18px] py-2 text-[13px] font-semibold"
              >
                Decline
              </button>
            </>
          )}
          {consultation.status === 'accepted' && (
            <button
              onClick={() => handleStatusUpdate('in_progress')}
              className="btn btn-primary px-[18px] py-2 text-[13px] font-semibold"
            >
              Start Consultation
            </button>
          )}
          {isActive && !doctorAlreadyConfirmed && (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className={`px-[18px] py-2 bg-success-500 text-white border-0 rounded cursor-pointer text-[13px] font-semibold
                ${confirming ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {confirming ? 'Confirming…' : 'Confirm Completion'}
            </button>
          )}
        </div>

        {isActive && consultation.scheduledAt && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
              Join Scheduled Call
            </p>
            <JoinCallButton
              appointmentId={consultation.id}
              scheduledAt={consultation.scheduledAt}
              hostUserId={consultation.doctorId}
              participantUserIds={[consultation.patientId, consultation.doctorId]}
            />
          </div>
        )}
      </div>

      {(isActive || isCompleted) && (
        <ChatWindow consultationId={consultation.id} disabled={isCompleted} />
      )}
    </div>
  );
};

export default DoctorConsultationDetail;
