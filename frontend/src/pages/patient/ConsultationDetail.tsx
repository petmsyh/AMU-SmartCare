import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchConsultationById,
  confirmConsultation,
  rateDoctor,
} from '../../store/slices/consultationsSlice';
import ChatWindow from '../../components/ChatWindow';
import RatingStars from '../../components/RatingStars';
import JoinCallButton from '../../components/JoinCallButton';

const statusClasses: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  accepted: 'bg-success-100 text-success-700',
  declined: 'bg-danger-100 text-danger-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-100 text-gray-600',
  disputed: 'bg-pink-100 text-pink-700',
};

const PatientConsultationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selected: consultation, loading, error } = useSelector((state: RootState) => state.consultations);

  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchConsultationById(id));
  }, [id, dispatch]);

  const handleConfirm = async () => {
    if (!id) return;
    setConfirming(true);
    await dispatch(confirmConsultation(id));
    setConfirming(false);
    dispatch(fetchConsultationById(id));
  };

  const handleRate = async () => {
    if (!consultation) return;
    setRatingError('');
    const result = await dispatch(
      rateDoctor({
        doctorId: consultation.doctorId,
        consultationId: consultation.id,
        score: ratingScore,
        comment: ratingComment || undefined,
      })
    );
    if (rateDoctor.fulfilled.match(result)) {
      setRatingSubmitted(true);
    } else {
      setRatingError((result.payload as string) || 'Failed to submit rating');
    }
  };

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return (
    <div className="bg-danger-100 text-danger-700 px-3.5 py-2.5 rounded-md">
      {error}
    </div>
  );
  if (!consultation) return null;

  const isCompleted = consultation.status === 'completed';
  const isActive = ['accepted', 'in_progress'].includes(consultation.status);
  const patientAlreadyConfirmed = consultation.patientConfirmed;

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="m-0 text-xl font-semibold">Consultation Detail</h2>
          <span className={`${badgeClass} px-3 py-1 rounded-full text-xs font-semibold capitalize`}>
            {consultation.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[
            { label: 'Doctor', value: consultation.doctor?.username || consultation.doctorId },
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
            <div className="text-[11px] text-gray-500 mb-1 font-semibold">Notes</div>
            <p className="m-0 text-[13px] text-gray-600">{consultation.notes}</p>
          </div>
        )}

        {isActive && !patientAlreadyConfirmed && (
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className={`btn bg-success-500 text-white border-0 px-5 py-2 text-[13px] font-semibold
              ${confirming ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {confirming ? 'Confirming…' : 'Confirm Completion'}
          </button>
        )}

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
        <div className="mb-4">
          <ChatWindow consultationId={consultation.id} disabled={isCompleted} />
        </div>
      )}

      {isCompleted && !ratingSubmitted && (
        <div className="card">
          <h3 className="mt-0 mb-3 text-base font-semibold">Rate Your Doctor</h3>
          <div className="mb-3">
            <RatingStars value={ratingScore} onChange={setRatingScore} size={28} />
          </div>
          <textarea
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Leave a comment (optional)…"
            rows={3}
            className="form-input resize-y mb-3"
          />
          {ratingError && (
            <div className="bg-danger-100 text-danger-700 px-2.5 py-1.5 rounded mb-2 text-[13px]">
              {ratingError}
            </div>
          )}
          <button
            onClick={handleRate}
            className="btn bg-accent-400 text-gray-800 border-0 px-5 py-2 text-[13px] font-semibold"
          >
            Submit Rating
          </button>
        </div>
      )}

      {ratingSubmitted && (
        <div className="bg-success-100 text-success-700 px-4 py-3 rounded-lg font-semibold">
          ✅ Thank you for your rating!
        </div>
      )}
    </div>
  );
};

export default PatientConsultationDetail;
