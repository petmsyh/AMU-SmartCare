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
      <h2 className="mb-5 text-[22px] font-semibold">Rating Moderation</h2>

      {actionMsg && (
        <div className="bg-success-100 text-success-700 px-3.5 py-2 rounded-md mb-3.5 text-[13px]">
          ✅ {actionMsg}
        </div>
      )}

      {loading && <p className="text-gray-500">Loading ratings…</p>}
      {error && (
        <div className="bg-danger-100 text-danger-700 px-3.5 py-2.5 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {ratings.map((r) => (
          <div
            key={r.id}
            className={`border rounded-lg px-[18px] py-3.5 flex items-start justify-between gap-3 shadow-sm
              ${r.isHidden ? 'bg-gray-50 border-gray-300 opacity-70' : 'bg-white border-gray-200'}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <RatingStars value={r.score} size={15} />
                <span className="font-semibold text-sm">{r.score}/5</span>
                {r.isHidden && (
                  <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                    HIDDEN
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                Patient: <strong>{r.patient?.username || r.patientId}</strong> &bull; Doctor ID:{' '}
                {r.doctorId} &bull; {new Date(r.createdAt).toLocaleDateString()}
              </div>
              {r.comment && (
                <p className="m-0 text-[13px] text-gray-600 italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
              )}
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => handleHide(r.id, r.isHidden)}
                className={`px-3 py-1 border-0 rounded cursor-pointer text-[11px] font-semibold
                  ${r.isHidden ? 'bg-success-500 text-white' : 'bg-accent-400 text-gray-800'}`}
              >
                {r.isHidden ? 'Show' : 'Hide'}
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="btn btn-danger px-3 py-1 text-[11px] font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && ratings.length === 0 && (
          <p className="text-gray-500 text-center py-5">No ratings found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminRatings;
