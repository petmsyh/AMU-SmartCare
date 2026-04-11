import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchMyDoctorProfile,
  createDoctorProfile,
  updateDoctorProfile,
} from '../../store/slices/doctorsSlice';
import { DoctorTier } from '../../types';

const DoctorProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selected: profile, loading, error } = useSelector((state: RootState) => state.doctors);

  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState(0);
  const [bio, setBio] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [consultationFee, setConsultationFee] = useState(0);
  const [tier, setTier] = useState<DoctorTier>('GeneralPractitioner');
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchMyDoctorProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setSpecialty(profile.specialty || '');
      setExperience(profile.experience || 0);
      setBio(profile.bio || '');
      setContactInfo(profile.contactInfo || '');
      setConsultationFee(profile.consultationFee || 0);
      setTier(profile.tier || 'GeneralPractitioner');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setFormError('');
    const data = { fullName, specialty, experience, bio, contactInfo, consultationFee, tier };
    const action = profile ? updateDoctorProfile(data) : createDoctorProfile(data);
    const result = await dispatch(action);
    if (updateDoctorProfile.fulfilled.match(result) || createDoctorProfile.fulfilled.match(result)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setFormError((result.payload as string) || 'Failed to save profile');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    marginBottom: 14,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ margin: '0 0 20px', fontSize: 22 }}>
        {profile ? 'Update My Profile' : 'Create My Profile'}
      </h2>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 10,
          padding: 28,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {loading && <p style={{ color: '#666' }}>Loading profile…</p>}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Full Name *</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Dr. John Smith"
            style={inputStyle}
          />

          <label style={labelStyle}>Specialty *</label>
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
            placeholder="e.g. Cardiology, Neurology"
            style={inputStyle}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 0 }}>
            <div>
              <label style={labelStyle}>Years of Experience *</label>
              <input
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                required
                style={{ ...inputStyle, marginBottom: 0 }}
              />
            </div>
            <div>
              <label style={labelStyle}>Consultation Fee (₹) *</label>
              <input
                type="number"
                min={0}
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                required
                style={{ ...inputStyle, marginBottom: 0 }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 14 }} />

          <label style={labelStyle}>Tier</label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as DoctorTier)}
            style={{ ...inputStyle, background: '#fff' }}
          >
            <option value="GeneralPractitioner">General Practitioner</option>
            <option value="Specialist">Specialist</option>
            <option value="SuperSpecialist">Super Specialist</option>
          </select>

          <label style={labelStyle}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Brief description of your expertise and background…"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          <label style={labelStyle}>Contact Info</label>
          <input
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Phone, clinic address, etc."
            style={inputStyle}
          />

          {(error || formError) && (
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
              {error || formError}
            </div>
          )}

          {saved && (
            <div
              style={{
                background: '#e8f5e9',
                color: '#2e7d32',
                padding: '8px 12px',
                borderRadius: 4,
                marginBottom: 14,
                fontSize: 13,
              }}
            >
              ✅ Profile saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
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
            {loading ? 'Saving…' : profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfileForm;
