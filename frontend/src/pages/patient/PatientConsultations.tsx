import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMyConsultations } from '../../store/slices/consultationsSlice';
import { ConsultationStatus } from '../../types';

const statusClass: Record<ConsultationStatus, string> = {
  pending: 'bg-orange-100 text-orange-700',
  accepted: 'bg-success-100 text-success-700',
  declined: 'bg-danger-100 text-danger-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-100 text-gray-600',
  disputed: 'bg-pink-100 text-pink-700',
};

const PatientConsultations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: consultations, loading, error } = useSelector(
    (state: RootState) => state.consultations,
  );

  useEffect(() => {
    dispatch(fetchMyConsultations());
  }, [dispatch]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="m-0 text-2xl font-bold text-gray-800">
          My Consultations
        </h2>
        <Link to="/patient/doctors" className="btn-primary btn-sm">
          + New Consultation
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading consultations…</p>}
      {error && (
        <div className="mb-4 rounded-lg bg-danger-100 px-4 py-3 text-danger-700">
          {error}
        </div>
      )}

      {!loading && consultations.length === 0 && (
        <div className="card p-10 text-center text-gray-500">
          <p className="mb-3 text-base">No consultations yet</p>
          <Link
            to="/patient/doctors"
            className="font-semibold text-primary-500"
          >
            Find a doctor to get started
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {consultations.map((c) => (
          <div
            key={c.id}
            className="card flex items-center justify-between gap-3 px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-sm font-semibold text-gray-800">
                Dr. {c.doctor?.username || c.doctorId}
              </div>
              <div className="text-xs text-gray-500">
                {c.scheduledAt
                  ? new Date(c.scheduledAt).toLocaleString()
                  : 'No date set'}{' '}
                &bull; {new Date(c.createdAt).toLocaleDateString()}
              </div>
              {c.notes && (
                <div className="mt-1 truncate text-xs text-gray-500">
                  {c.notes}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`badge capitalize ${statusClass[c.status] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {c.status.replace('_', ' ')}
              </span>
              <Link
                to={`/patient/consultations/${c.id}`}
                className="btn-outline btn-sm"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientConsultations;
