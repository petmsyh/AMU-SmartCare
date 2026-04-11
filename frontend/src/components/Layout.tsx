import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const patientLinks = [
  { to: '/patient', label: 'Dashboard', icon: '🏠' },
  { to: '/patient/doctors', label: 'Find Doctors', icon: '🔍' },
  { to: '/patient/consultations', label: 'My Consultations', icon: '📋' },
  { to: '/patient/ai-assistant', label: 'AI Assistant', icon: '🤖' },
];

const doctorLinks = [
  { to: '/doctor', label: 'Dashboard', icon: '🏠' },
  { to: '/doctor/profile', label: 'My Profile', icon: '👤' },
  { to: '/doctor/consultations', label: 'Consultations', icon: '📋' },
  { to: '/doctor/wallet', label: 'Wallet', icon: '💰' },
];

const studentLinks = [{ to: '/student', label: 'Dashboard', icon: '🎓' }];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/ratings', label: 'Ratings', icon: '⭐' },
  { to: '/admin/payments', label: 'Mock Payments', icon: '💳' },
];

const roleConfig: Record<string, { color: string; label: string; bg: string }> = {
  patient: { color: '#1a73e8', label: 'Patient', bg: '#e8f0fe' },
  doctor: { color: '#0d47a1', label: 'Doctor', bg: '#dbe8fb' },
  student: { color: '#7b1fa2', label: 'Student', bg: '#f3e5f5' },
  admin: { color: '#c62828', label: 'Admin', bg: '#fce8e6' },
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getLinksByRole = () => {
    switch (user?.role) {
      case 'patient': return patientLinks;
      case 'doctor': return doctorLinks;
      case 'student': return studentLinks;
      case 'admin': return adminLinks;
      default: return [];
    }
  };

  const links = getLinksByRole();
  const rc = roleConfig[user?.role || ''] || { color: '#1a73e8', label: '', bg: '#e8f0fe' };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f5f7fa' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 199 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        style={{
          width: 256,
          background: '#fff',
          borderRight: '1px solid #eee',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
          zIndex: 200,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <img src="/amu-logo.svg" alt="AMU" style={{ width: 36, height: 36 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#0d47a1', lineHeight: 1.2 }}>
              AMU SmartCare
            </div>
            <div style={{ fontSize: 10, color: '#999', letterSpacing: 0.3 }}>
              Arba Minch University
            </div>
          </div>
        </div>

        {/* User Info */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${rc.color}, #0d47a1)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 4 }}>
            {user?.username}
          </div>
          <span
            style={{
              background: rc.bg,
              color: rc.color,
              padding: '2px 10px',
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'capitalize',
            }}
          >
            {rc.label}
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: 1, textTransform: 'uppercase', padding: '4px 8px 10px' }}>
            Navigation
          </div>
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  color: active ? rc.color : '#555',
                  textDecoration: 'none',
                  background: active ? rc.bg : 'transparent',
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  marginBottom: 2,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: '1.5px solid #e0e0e0',
              borderRadius: 10,
              color: '#555',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            background: '#fff',
            borderBottom: '1px solid #eee',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div>
            <span style={{ fontSize: 14, color: '#666' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${rc.color}, #0d47a1)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{user?.username}</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
