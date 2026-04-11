import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchConsultationById,
  confirmConsultation,
  updateConsultationStatus,
} from '../../store/slices/consultationsSlice';
import ChatWindow from '../../components/ChatWindow';

const DoctorConsultationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selected: consultation, loading, error } = useSelector((state: RootState) => state.consultations);
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

  const handleStatusUpdate = async (status: string) => {
    if (!id) return;
    await dispatch(updateConsultationStatus({ id, status }));
    dispatch(fetchConsultationById(id));
  };

  if (loading) return <p style={{ color: '#666' }}>Loading…</p>;
  if (error) return (
    <div style={{ background: '#fce8e6', color: '#c5221f', padding: '10px 14px', borderRadius: 6 }}>
      {error}
    </div>
  );
  if (!consultation) return null;

  const isActive = ['accepted', 'in_progress'].includes(consultation.status);
  const isCompleted = consultation.status === 'completed';
  const doctorAlreadyConfirmed = consultation.doctorConfirmed;

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fff3e0', color: '#e65100' },
    accepted: { bg: '#e8f5e9', color: '#2e7d32' },
    declined: { bg: '#fce8e6', color: '#c5221f' },
    in_progress: { bg: '#e3f2fd', color: '#1565c0' },
    completed: { bg: '#f3e5f5', color: '#6a1b9a' },
    cancelled: { bg: '#f5f5f5', color: '#757575' },
    disputed: { bg: '#fce4ec', color: '#880e4f' },
  };

  const s = statusColors[consultation.status] || { bg: '#f5f5f5', color: '#333' };

  return (
    <div style={{ maxWidth: 700 }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: 14, marginBottom: 16, padding: 0 }}
      >
        ← Back to Consultations
      </button>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 10,
          padding: 24,
          marginBottom: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Consultation Detail</h2>
          <span
            style={{
              background: s.bg,
              color: s.color,
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {consultation.status.replace('_', ' ')}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Patient', value: consultation.patient?.username || consultation.patientId },
            { label: 'Scheduled', value: consultation.scheduledAt ? new Date(consultation.scheduledAt).toLocaleString() : 'Not set' },
            { label: 'Patient Confirmed', value: consultation.patientConfirmed ? '✅ Yes' : '⏳ No' },
            { label: 'Doctor Confirmed', value: consultation.doctorConfirmed ? '✅ Yes' : '⏳ No' },
          ].map((item) => (
            <div key={item.label} style={{ background: '#f8f9fa', padding: '10px 12px', borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 2, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {consultation.notes && (
          <div style={{ background: '#f8f9fa', padding: '10px 12px', borderRadius: 6, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#666', marginBottom: 4, fontWeight: 600 }}>Patient Notes</div>
            <p style={{ margin: 0, fontSize: 13, color: '#555' }}>{consultation.notes}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {consultation.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate('accepted')}
                style={{ padding: '8px 18px', background: '#34a853', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate('declined')}
                style={{ padding: '8px 18px', background: '#ea4335', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Decline
              </button>
            </>
          )}
          {consultation.status === 'accepted' && (
            <button
              onClick={() => handleStatusUpdate('in_progress')}
              style={{ padding: '8px 18px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              Start Consultation
            </button>
          )}
          {isActive && !doctorAlreadyConfirmed && (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              style={{ padding: '8px 18px', background: '#34a853', color: '#fff', border: 'none', borderRadius: 4, cursor: confirming ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: confirming ? 0.7 : 1 }}
            >
              {confirming ? 'Confirming…' : 'Confirm Completion'}
            </button>
          )}
        </div>
      </div>

      {(isActive || isCompleted) && (
        <ChatWindow consultationId={consultation.id} disabled={isCompleted} />
      )}
    </div>
  );
};

export default DoctorConsultationDetail;
