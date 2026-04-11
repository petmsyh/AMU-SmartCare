import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMyConsultations, updateConsultationStatus } from '../../store/slices/consultationsSlice';
import { ConsultationStatus } from '../../types';

const statusClasses: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  accepted: 'bg-success-100 text-success-700',
  declined: 'bg-danger-100 text-danger-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-100 text-gray-600',
  disputed: 'bg-pink-100 text-pink-700',
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
      <h2 className="mb-5 text-[22px] font-semibold">My Consultations</h2>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && (
        <div className="bg-danger-100 text-danger-700 px-3.5 py-2.5 rounded-md">
          {error}
        </div>
      )}

      {!loading && consultations.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
          No consultations yet.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {consultations.map((c) => {
          const badgeClass = statusClasses[c.status] ?? 'bg-gray-100 text-gray-600';
          return (
            <div
              key={c.id}
              className="bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] mb-0.5">
                    Patient: {c.patient?.username || c.patientId}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : 'No date'} &bull;{' '}
                    Booked {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                  {c.notes && (
                    <div className="text-xs text-gray-600 italic">
                      &ldquo;{c.notes}&rdquo;
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <span className={`${badgeClass} px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize`}>
                    {c.status.replace('_', ' ')}
                  </span>

                  {c.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(c.id, 'accepted')}
                        className="px-3 py-1 bg-success-500 text-white rounded text-xs font-semibold cursor-pointer border-0"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(c.id, 'declined')}
                        className="px-3 py-1 bg-danger-500 text-white rounded text-xs font-semibold cursor-pointer border-0"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {c.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusUpdate(c.id, 'in_progress')}
                      className="px-3 py-1 bg-primary-500 text-white rounded text-xs font-semibold cursor-pointer border-0"
                    >
                      Start
                    </button>
                  )}

                  <Link
                    to={`/doctor/consultations/${c.id}`}
                    className="px-3 py-1 bg-primary-50 text-primary-500 rounded text-xs font-semibold no-underline"
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
