import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMyConsultations } from '../../store/slices/consultationsSlice';
import { ConsultationStatus } from '../../types';

const statusColors: Record<ConsultationStatus, { bg: string; color: string }> = {
  pending: { bg: '#fff3e0', color: '#e65100' },
  accepted: { bg: '#e8f5e9', color: '#2e7d32' },
  declined: { bg: '#fce8e6', color: '#c5221f' },
  in_progress: { bg: '#e3f2fd', color: '#1565c0' },
  completed: { bg: '#f3e5f5', color: '#6a1b9a' },
  cancelled: { bg: '#f5f5f5', color: '#757575' },
  disputed: { bg: '#fce4ec', color: '#880e4f' },
};

const PatientConsultations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: consultations, loading, error } = useSelector((state: RootState) => state.consultations);

  useEffect(() => {
    dispatch(fetchMyConsultations());
  }, [dispatch]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>My Consultations</h2>
        <Link
          to="/patient/doctors"
          style={{
            padding: '8px 16px',
            background: '#1a73e8',
            color: '#fff',
            borderRadius: 4,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          + New Consultation
        </Link>
      </div>

      {loading && <p style={{ color: '#666' }}>Loading consultations…</p>}
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
          <p style={{ fontSize: 16, margin: '0 0 12px' }}>No consultations yet</p>
          <Link to="/patient/doctors" style={{ color: '#1a73e8', fontWeight: 600 }}>
            Find a doctor to get started
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {consultations.map((c) => {
          const statusStyle = statusColors[c.status] || { bg: '#f5f5f5', color: '#333' };
          return (
            <div
              key={c.id}
              style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  Dr. {c.doctor?.username || c.doctorId}
                </div>
                <div style={{ fontSize: 13, color: '#666' }}>
                  {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : 'No date set'} &bull;{' '}
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
                {c.notes && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#555',
                      marginTop: 4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.notes}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.status.replace('_', ' ')}
                </span>
                <Link
                  to={`/patient/consultations/${c.id}`}
                  style={{
                    padding: '6px 14px',
                    background: '#e8f0fe',
                    color: '#1a73e8',
                    borderRadius: 4,
                    textDecoration: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  View
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatientConsultations;
