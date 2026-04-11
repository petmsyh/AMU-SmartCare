import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { login } from '../store/slices/authSlice';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      const role = result.payload.user?.role;
      const routes: Record<string, string> = {
        patient: '/patient',
        doctor: '/doctor',
        student: '/student',
        admin: '/admin',
      };
      navigate(routes[role] || '/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-900 p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-auth">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/amu-logo.svg" alt="AMU Logo" className="w-14 h-14" />
        </div>
        <h1 className="text-center text-2xl font-extrabold text-gray-900 mb-1">AMU SmartCare</h1>
        <p className="text-center text-sm text-gray-400 mb-8">Patient-Doctor Connection Platform</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && (
            <div className="bg-danger-100 text-danger-700 px-4 py-2.5 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary btn-lg w-full mt-2">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary-500 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
