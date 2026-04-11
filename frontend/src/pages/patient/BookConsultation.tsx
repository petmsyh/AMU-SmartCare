import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDoctorById } from '../../store/slices/doctorsSlice';
import { createConsultation } from '../../store/slices/consultationsSlice';
import MockPaymentModal from '../../components/MockPaymentModal';

const BookConsultation: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selected: doctor } = useSelector((state: RootState) => state.doctors);
  const { loading, error } = useSelector((state: RootState) => state.consultations);

  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [createdConsultationId, setCreatedConsultationId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (doctorId) dispatch(fetchDoctorById(doctorId));
  }, [doctorId, dispatch]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!doctorId) return;
    const result = await dispatch(
      createConsultation({ doctorId, scheduledAt: scheduledAt || undefined, notes: notes || undefined })
    );
    if (createConsultation.fulfilled.match(result)) {
      setCreatedConsultationId(result.payload.id);
      setShowPayment(true);
    } else {
      setSubmitError((result.payload as string) || 'Failed to book consultation');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate('/patient/consultations');
  };

  if (!doctor) return <p className="text-gray-500">Loading doctor info…</p>;
  const fee = Number(doctor.consultationFee ?? 0);
  const safeFee = Number.isFinite(fee) ? fee : 0;

  return (
    <div className="max-w-[520px]">
      <button
        onClick={() => navigate(-1)}
        className="bg-transparent border-0 text-primary-500 cursor-pointer text-sm mb-4 p-0"
      >
        ← Back
      </button>

      <div className="card">
        <h2 className="mt-0 mb-1.5 text-xl font-semibold">Book Consultation</h2>
        <p className="mt-0 mb-5 text-gray-500 text-sm">
          with <strong>{doctor.fullName}</strong> — {doctor.specialty}
        </p>
        <div className="bg-primary-50 text-primary-500 px-3.5 py-2.5 rounded-md mb-5 text-[13px]">
          Consultation Fee: <strong>₹{safeFee}</strong>
        </div>

        <form onSubmit={handleBook}>
          <label className="form-label">Preferred Date &amp; Time (optional)</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="form-input"
          />

          <label className="form-label">Notes / Symptoms</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your symptoms or reason for consultation…"
            rows={4}
            className="form-input resize-y"
          />

          {(error || submitError) && (
            <div className="bg-danger-100 text-danger-700 px-3 py-2 rounded mb-3.5 text-[13px]">
              {error || submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary w-full py-3 text-sm font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Booking…' : 'Continue to Payment'}
          </button>
        </form>
      </div>

      {showPayment && createdConsultationId && (
        <MockPaymentModal
          consultationId={createdConsultationId}
          amount={safeFee}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default BookConsultation;
