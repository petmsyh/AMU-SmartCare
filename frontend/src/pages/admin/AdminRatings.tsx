import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Rating } from '../../types';
import RatingStars from '../../components/RatingStars';

const AdminRatings: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const loadRatings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/ratings');
      setRatings(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load ratings');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRatings();
  }, []);

  const handleHide = async (ratingId: string, isHidden: boolean) => {
    try {
      await api.patch(`/admin/ratings/${ratingId}`, { isHidden: !isHidden });
      setActionMsg(`Rating ${isHidden ? 'shown' : 'hidden'}`);
      loadRatings();
    } catch (err: any) {
      setActionMsg(err.response?.data?.message || 'Action failed');
    }
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleDelete = async (ratingId: string) => {
    if (!window.confirm('Delete this rating permanently?')) return;
    try {
      await api.delete(`/admin/ratings/${ratingId}`);
      setActionMsg('Rating deleted');
      loadRatings();
    } catch (err: any) {
      setActionMsg(err.response?.data?.message || 'Delete failed');
    }
    setTimeout(() => setActionMsg(''), 3000);
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 22 }}>Rating Moderation</h2>

      {actionMsg && (
        <div
          style={{
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '8px 14px',
            borderRadius: 6,
            marginBottom: 14,
            fontSize: 13,
          }}
        >
          ✅ {actionMsg}
        </div>
      )}

      {loading && <p style={{ color: '#666' }}>Loading ratings…</p>}
      {error && (
        <div style={{ background: '#fce8e6', color: '#c5221f', padding: '10px 14px', borderRadius: 6 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ratings.map((r) => (
          <div
            key={r.id}
            style={{
              background: r.isHidden ? '#f8f8f8' : '#fff',
              border: `1px solid ${r.isHidden ? '#ddd' : '#e0e0e0'}`,
              borderRadius: 8,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              opacity: r.isHidden ? 0.7 : 1,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <RatingStars value={r.score} size={15} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{r.score}/5</span>
                {r.isHidden && (
                  <span
                    style={{
                      background: '#f5f5f5',
                      color: '#757575',
                      fontSize: 10,
                      padding: '1px 6px',
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    HIDDEN
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                Patient: <strong>{r.patient?.username || r.patientId}</strong> &bull; Doctor ID:{' '}
                {r.doctorId} &bull; {new Date(r.createdAt).toLocaleDateString()}
              </div>
              {r.comment && (
                <p style={{ margin: 0, fontSize: 13, color: '#555', fontStyle: 'italic' }}>
                  "{r.comment}"
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => handleHide(r.id, r.isHidden)}
                style={{
                  padding: '5px 12px',
                  background: r.isHidden ? '#34a853' : '#fbbc04',
                  color: r.isHidden ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {r.isHidden ? 'Show' : 'Hide'}
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                style={{
                  padding: '5px 12px',
                  background: '#ea4335',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && ratings.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', padding: 20 }}>No ratings found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminRatings;
