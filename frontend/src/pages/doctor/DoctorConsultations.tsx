import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMyConsultations, updateConsultationStatus } from '../../store/slices/consultationsSlice';
import { ConsultationStatus } from '../../types';

const statusColors: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#fff3e0', color: '#e65100' },
  accepted: { bg: '#e8f5e9', color: '#2e7d32' },
  declined: { bg: '#fce8e6', color: '#c5221f' },
  in_progress: { bg: '#e3f2fd', color: '#1565c0' },
  completed: { bg: '#f3e5f5', color: '#6a1b9a' },
  cancelled: { bg: '#f5f5f5', color: '#757575' },
  disputed: { bg: '#fce4ec', color: '#880e4f' },
};

const DoctorConsultations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: consultations, loading, error } = useSelector((state: RootState) => state.consultations);

  useEffect(() => {
    dispatch(fetchMyConsultations());
  }, [dispatch]);

  const handleStatusUpdate = async (id: string, status: ConsultationStatus) => {
    await dispatch(updateConsultationStatus({ id, status }));
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 22 }}>My Consultations</h2>

      {loading && <p style={{ color: '#666' }}>Loading…</p>}
      {error && (
        <div style={{ background: '#fce8e6', color: '#c5221f', padding: '10px 14px', borderRadius: 6 }}>
          {error}
        </div>
      )}

      {!loading && consultations.length === 0 && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 10,
            padding: 40,
            textAlign: 'center',
            color: '#666',
          }}
        >
          No consultations yet.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {consultations.map((c) => {
          const s = statusColors[c.status] || { bg: '#f5f5f5', color: '#333' };
          return (
            <div
              key={c.id}
              style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: '16px 20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>
                    Patient: {c.patient?.username || c.patientId}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                    {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : 'No date'} &bull;{' '}
                    Booked {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                  {c.notes && (
                    <div style={{ fontSize: 12, color: '#555', fontStyle: 'italic' }}>
                      "{c.notes}"
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: s.bg,
                      color: s.color,
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {c.status.replace('_', ' ')}
                  </span>

                  {c.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(c.id, 'accepted')}
                        style={{
                          padding: '5px 12px',
                          background: '#34a853',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(c.id, 'declined')}
                        style={{
                          padding: '5px 12px',
                          background: '#ea4335',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {c.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusUpdate(c.id, 'in_progress')}
                      style={{
                        padding: '5px 12px',
                        background: '#1a73e8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Start
                    </button>
                  )}

                  <Link
                    to={`/doctor/consultations/${c.id}`}
                    style={{
                      padding: '5px 12px',
                      background: '#e8f0fe',
                      color: '#1a73e8',
                      borderRadius: 4,
                      textDecoration: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorConsultations;
