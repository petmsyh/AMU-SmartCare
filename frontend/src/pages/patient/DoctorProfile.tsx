import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDoctorById } from '../../store/slices/doctorsSlice';
import RatingStars from '../../components/RatingStars';
import api from '../../api/axios';
import { Rating } from '../../types';

const tierClasses: Record<string, string> = {
  GeneralPractitioner: 'bg-success-100 text-success-500',
  Specialist: 'bg-primary-50 text-primary-500',
  SuperSpecialist: 'bg-purple-100 text-purple-500',
};

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selected: doctor, loading, error } = useSelector((state: RootState) => state.doctors);
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorById(id));
      api.get(`/ratings/doctor/${id}`).then((res) => setRatings(res.data)).catch(() => {});
    }
  }, [id, dispatch]);

  if (loading) return <p className="text-gray-500">Loading doctor profile…</p>;
  if (error) return (
    <div className="bg-danger-100 text-danger-700 px-3.5 py-2.5 rounded-md">
      {error}
    </div>
  );
  if (!doctor) return null;

  const consultationFee = Number(doctor.consultationFee ?? 0);
  const averageRating = Number(doctor.averageRating ?? 0);
  const safeConsultationFee = Number.isFinite(consultationFee) ? consultationFee : 0;
  const safeAverageRating = Number.isFinite(averageRating) ? averageRating : 0;

  return (
    <div className="max-w-[720px]">
      <button
        onClick={() => navigate(-1)}
        className="bg-transparent border-0 text-primary-500 cursor-pointer text-sm mb-4 p-0"
      >
        ← Back
      </button>

      <div className="card mb-5">
        <div className="flex gap-5 items-start mb-5">
          <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center text-4xl flex-shrink-0">
            👨‍⚕️
          </div>
          <div>
            <h2 className="mt-0 mb-1.5 text-[22px] font-semibold">{doctor.fullName}</h2>
            <p className="mt-0 mb-2 text-gray-600 text-sm">{doctor.specialty}</p>
            <div className="flex gap-2 flex-wrap">
              <span className={`${tierClasses[doctor.tier] ?? 'bg-gray-100 text-gray-600'} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                {doctor.tier}
              </span>
              <span className="text-[13px] text-gray-500 self-center">
                {doctor.experience} years experience
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Consultation Fee', value: `₹${safeConsultationFee}` },
            { label: 'Rating', value: `${safeAverageRating.toFixed(1)} / 5 (${doctor.totalRatings} reviews)` },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 p-3 rounded-md">
              <div className="text-[11px] text-gray-500 mb-1 font-semibold">{item.label}</div>
              <div className="font-semibold text-[15px]">{item.value}</div>
            </div>
          ))}
        </div>

        {doctor.bio && (
          <div className="mb-4">
            <h4 className="mt-0 mb-1.5 text-sm font-semibold">About</h4>
            <p className="m-0 text-gray-600 text-[13px] leading-relaxed">{doctor.bio}</p>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <RatingStars value={Math.round(safeAverageRating)} size={18} />
          <span className="text-[13px] text-gray-500">{safeAverageRating.toFixed(1)} avg</span>
        </div>

        <button
          onClick={() => navigate(`/patient/book/${doctor.id}`)}
          className="btn btn-primary px-6 py-2.5 text-sm font-semibold"
        >
          Book Consultation
        </button>
      </div>

      {ratings.length > 0 && (
        <div className="card">
          <h3 className="mt-0 mb-4 text-base font-semibold">Patient Reviews</h3>
          <div className="flex flex-col gap-3">
            {ratings.map((r) => (
              <div key={r.id} className="border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <RatingStars value={r.score} size={14} />
                  <span className="text-xs text-gray-500">
                    by {r.patient?.username || 'Anonymous'} &bull; {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p className="m-0 text-[13px] text-gray-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
