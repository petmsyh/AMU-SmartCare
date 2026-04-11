import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { register } from '../store/slices/authSlice';
import { Role } from '../types';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('patient');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ email, password, username, role }));
    if (register.fulfilled.match(result)) {
      const roleRoutes: Record<string, string> = {
        patient: '/patient',
        doctor: '/doctor',
        student: '/student',
        admin: '/admin',
      };
      navigate(roleRoutes[role] || '/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-900 p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-auth">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/amu-logo.svg" alt="AMU Logo" className="w-14 h-14" />
        </div>
        <h1 className="text-center text-2xl font-extrabold text-gray-900 mb-1">Create Account</h1>
        <p className="text-center text-sm text-gray-400 mb-8">Join AMU SmartCare</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="johndoe"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="form-input"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="student">Student</option>
            </select>
          </div>

          {error && (
            <div className="bg-danger-100 text-danger-700 px-4 py-2.5 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary btn-lg w-full mt-2">
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
