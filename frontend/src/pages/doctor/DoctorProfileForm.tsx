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

  return (
    <div className="max-w-[600px]">
      <h2 className="mb-5 text-[22px] font-semibold">
        {profile ? 'Update My Profile' : 'Create My Profile'}
      </h2>

      <div className="card">
        {loading && <p className="text-gray-500">Loading profile…</p>}

        <form onSubmit={handleSubmit}>
          <label className="form-label">Full Name *</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Dr. John Smith"
            className="form-input"
          />

          <label className="form-label">Specialty *</label>
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
            placeholder="e.g. Cardiology, Neurology"
            className="form-input"
          />

          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <div>
              <label className="form-label">Years of Experience *</label>
              <input
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                required
                className="form-input mb-0"
              />
            </div>
            <div>
              <label className="form-label">Consultation Fee (₹) *</label>
              <input
                type="number"
                min={0}
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                required
                className="form-input mb-0"
              />
            </div>
          </div>

          <label className="form-label">Tier</label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as DoctorTier)}
            className="form-input bg-white"
          >
            <option value="GeneralPractitioner">General Practitioner</option>
            <option value="Specialist">Specialist</option>
            <option value="SuperSpecialist">Super Specialist</option>
          </select>

          <label className="form-label">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Brief description of your expertise and background…"
            rows={3}
            className="form-input resize-y"
          />

          <label className="form-label">Contact Info</label>
          <input
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Phone, clinic address, etc."
            className="form-input"
          />

          {(error || formError) && (
            <div className="bg-danger-100 text-danger-700 px-3 py-2 rounded mb-3.5 text-[13px]">
              {error || formError}
            </div>
          )}

          {saved && (
            <div className="bg-success-100 text-success-700 px-3 py-2 rounded mb-3.5 text-[13px]">
              ✅ Profile saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary w-full py-[11px] text-sm font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving…' : profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfileForm;
