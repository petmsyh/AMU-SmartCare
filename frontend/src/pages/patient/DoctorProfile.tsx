import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDoctorById } from '../../store/slices/doctorsSlice';
import RatingStars from '../../components/RatingStars';
import api from '../../api/axios';
import { Rating } from '../../types';

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

  if (loading) return <p style={{ color: '#666' }}>Loading doctor profile…</p>;
  if (error) return (
    <div style={{ background: '#fce8e6', color: '#c5221f', padding: '10px 14px', borderRadius: 6 }}>
      {error}
    </div>
  );
  if (!doctor) return null;

  const tierColor: Record<string, string> = {
    GeneralPractitioner: '#34a853',
    Specialist: '#1a73e8',
    SuperSpecialist: '#9c27b0',
  };

  return (
    <div style={{ maxWidth: 720 }}>
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
          marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#e8f0fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              flexShrink: 0,
            }}
          >
            👨‍⚕️
          </div>
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: 22 }}>{doctor.fullName}</h2>
            <p style={{ margin: '0 0 8px', color: '#555', fontSize: 14 }}>{doctor.specialty}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  background: `${tierColor[doctor.tier] || '#666'}20`,
                  color: tierColor[doctor.tier] || '#666',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 12,
                }}
              >
                {doctor.tier}
              </span>
              <span style={{ fontSize: 13, color: '#666', alignSelf: 'center' }}>
                {doctor.experience} years experience
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Consultation Fee', value: `₹${doctor.consultationFee}` },
            { label: 'Rating', value: `${doctor.averageRating.toFixed(1)} / 5 (${doctor.totalRatings} reviews)` },
          ].map((item) => (
            <div key={item.label} style={{ background: '#f8f9fa', padding: 12, borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 4, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {doctor.bio && (
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ margin: '0 0 6px', fontSize: 14 }}>About</h4>
            <p style={{ margin: 0, color: '#555', fontSize: 13, lineHeight: 1.6 }}>{doctor.bio}</p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <RatingStars value={Math.round(doctor.averageRating)} size={18} />
          <span style={{ fontSize: 13, color: '#666' }}>{doctor.averageRating.toFixed(1)} avg</span>
        </div>

        <button
          onClick={() => navigate(`/patient/book/${doctor.id}`)}
          style={{
            padding: '10px 24px',
            background: '#1a73e8',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Book Consultation
        </button>
      </div>

      {ratings.length > 0 && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 10,
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Patient Reviews</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ratings.map((r) => (
              <div key={r.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <RatingStars value={r.score} size={14} />
                  <span style={{ fontSize: 12, color: '#666' }}>
                    by {r.patient?.username || 'Anonymous'} &bull; {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p style={{ margin: 0, fontSize: 13, color: '#555' }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
