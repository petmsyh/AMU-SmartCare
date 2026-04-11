import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const patientLinks = [
  { to: '/patient', label: '🏠 Dashboard' },
  { to: '/patient/doctors', label: '🔍 Find Doctors' },
  { to: '/patient/consultations', label: '📋 My Consultations' },
  { to: '/patient/ai-assistant', label: '🤖 AI Assistant' },
];

const doctorLinks = [
  { to: '/doctor', label: '🏠 Dashboard' },
  { to: '/doctor/profile', label: '👤 My Profile' },
  { to: '/doctor/consultations', label: '📋 Consultations' },
  { to: '/doctor/wallet', label: '💰 Wallet' },
];

const studentLinks = [{ to: '/student', label: '🎓 Dashboard' }];

const adminLinks = [
  { to: '/admin', label: '🏠 Dashboard' },
  { to: '/admin/users', label: '👥 Users' },
  { to: '/admin/ratings', label: '⭐ Ratings' },
  { to: '/admin/payments', label: '💳 Mock Payments' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const getLinksByRole = () => {
    switch (user?.role) {
      case 'patient':
        return patientLinks;
      case 'doctor':
        return doctorLinks;
      case 'student':
        return studentLinks;
      case 'admin':
        return adminLinks;
      default:
        return [];
    }
  };

  const links = getLinksByRole();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        {links.length > 0 && (
          <aside
            style={{
              width: 220,
              background: '#fff',
              borderRight: '1px solid #e0e0e0',
              padding: '16px 0',
              flexShrink: 0,
            }}
          >
            <nav>
              {links.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      display: 'block',
                      padding: '10px 20px',
                      color: active ? '#1a73e8' : '#333',
                      textDecoration: 'none',
                      background: active ? '#e8f0fe' : 'transparent',
                      fontWeight: active ? 600 : 400,
                      borderLeft: active ? '3px solid #1a73e8' : '3px solid transparent',
                      fontSize: 14,
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
