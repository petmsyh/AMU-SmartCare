import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMyConsultations } from '../../store/slices/consultationsSlice';
import { fetchWallet } from '../../store/slices/paymentsSlice';

const statColors = ['#1a73e8', '#f4b400', '#34a853', '#0d47a1', '#9c27b0'];

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { list: consultations } = useSelector((state: RootState) => state.consultations);
  const { wallet } = useSelector((state: RootState) => state.payments);
  const safeConsultations = Array.isArray(consultations) ? consultations : [];
  const walletBalance = Number(wallet?.balance ?? 0);
  const formattedWalletBalance = Number.isFinite(walletBalance) ? walletBalance.toFixed(2) : '0.00';

  useEffect(() => {
    dispatch(fetchMyConsultations());
    dispatch(fetchWallet());
  }, [dispatch]);

  const stats = [
    { label: 'Total', value: safeConsultations.length, icon: '📋', color: '#1a73e8' },
    { label: 'Pending', value: safeConsultations.filter((c) => c.status === 'pending').length, icon: '⏳', color: '#f4b400' },
    { label: 'In Progress', value: safeConsultations.filter((c) => c.status === 'in_progress').length, icon: '🔄', color: '#9c27b0' },
    { label: 'Completed', value: safeConsultations.filter((c) => c.status === 'completed').length, icon: '✅', color: '#34a853' },
    { label: 'Wallet', value: `₹${formattedWalletBalance}`, icon: '💰', color: '#0d47a1' },
  ];

  const quickLinks = [
    { to: '/doctor/profile', label: 'Update Profile', desc: 'Edit your doctor profile', icon: '👤', color: '#1a73e8' },
    { to: '/doctor/consultations', label: 'View Consultations', desc: 'Manage patient requests', icon: '📋', color: '#34a853' },
    { to: '/doctor/wallet', label: 'Wallet', desc: 'View earnings & withdraw', icon: '💰', color: '#0d47a1' },
  ];

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
          borderRadius: 16,
          padding: '32px 28px',
          color: '#fff',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.75, marginBottom: 8 }}>
            Doctor Portal
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800 }}>Welcome, Dr. {user?.username}! 👨‍⚕️</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>Here's your practice overview</p>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: 14,
              padding: '18px 16px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${statColors[i % statColors.length]}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                margin: '0 auto 10px',
              }}
            >
              {s.icon}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              background: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: 14,
              padding: '22px 20px',
              textDecoration: 'none',
              color: '#333',
              display: 'block',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = '';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${link.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 12,
              }}
            >
              {link.icon}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 4 }}>{link.label}</div>
            <div style={{ fontSize: 12, color: '#777', marginBottom: 12 }}>{link.desc}</div>
            <div style={{ fontSize: 13, color: link.color, fontWeight: 600 }}>Go →</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
