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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    marginBottom: 14,
  };

  if (!doctor) return <p style={{ color: '#666' }}>Loading doctor info…</p>;
  const fee = Number(doctor.consultationFee ?? 0);
  const safeFee = Number.isFinite(fee) ? fee : 0;

  return (
    <div style={{ maxWidth: 520 }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: 14, marginBottom: 16, padding: 0 }}
      >
        ← Back
      </button>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 10,
          padding: 28,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <h2 style={{ margin: '0 0 6px', fontSize: 20 }}>Book Consultation</h2>
        <p style={{ margin: '0 0 20px', color: '#666', fontSize: 14 }}>
          with <strong>{doctor.fullName}</strong> — {doctor.specialty}
        </p>
        <div
          style={{
            background: '#e8f0fe',
            padding: '10px 14px',
            borderRadius: 6,
            marginBottom: 20,
            fontSize: 13,
            color: '#1a73e8',
          }}
        >
          Consultation Fee: <strong>₹{safeFee}</strong>
        </div>

        <form onSubmit={handleBook}>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Preferred Date & Time (optional)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            style={inputStyle}
          />

          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
            Notes / Symptoms
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your symptoms or reason for consultation…"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          {(error || submitError) && (
            <div
              style={{
                background: '#fce8e6',
                color: '#c5221f',
                padding: '8px 12px',
                borderRadius: 4,
                marginBottom: 14,
                fontSize: 13,
              }}
            >
              {error || submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a73e8',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
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
