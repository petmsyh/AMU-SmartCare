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

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 12,
    padding: 40,
    width: 400,
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    marginBottom: 14,
  };

  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    display: 'block',
    marginBottom: 4,
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ textAlign: 'center', margin: '0 0 6px', fontSize: 24 }}>Create Account</h1>
        <p style={{ textAlign: 'center', color: '#666', margin: '0 0 24px', fontSize: 13 }}>
          Join AMU SmartCare
        </p>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="johndoe"
            style={inputStyle}
          />
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={inputStyle}
          />
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={inputStyle}
          />
          <label style={labelStyle}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            style={{ ...inputStyle, background: '#fff' }}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="student">Student</option>
          </select>

          {error && (
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
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1a73e8', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
