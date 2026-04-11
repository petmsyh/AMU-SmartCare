import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMyConsultations } from '../../store/slices/consultationsSlice';
import { fetchWallet } from '../../store/slices/paymentsSlice';

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
    { label: 'Total Consultations', value: safeConsultations.length, icon: '📋' },
    { label: 'Pending', value: safeConsultations.filter((c) => c.status === 'pending').length, icon: '⏳' },
    { label: 'In Progress', value: safeConsultations.filter((c) => c.status === 'in_progress').length, icon: '🔄' },
    { label: 'Completed', value: safeConsultations.filter((c) => c.status === 'completed').length, icon: '✅' },
    { label: 'Wallet Balance', value: `₹${formattedWalletBalance}`, icon: '💰' },
  ];

  const quickLinks = [
    { to: '/doctor/profile', label: '👤 Update Profile', desc: 'Edit your doctor profile' },
    { to: '/doctor/consultations', label: '📋 View Consultations', desc: 'Manage patient requests' },
    { to: '/doctor/wallet', label: '💰 Wallet', desc: 'View earnings & withdraw' },
  ];

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
          borderRadius: 12,
          padding: '28px 24px',
          color: '#fff',
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: '0 0 4px', fontSize: 26 }}>Welcome, Dr. {user?.username}! 👨‍⚕️</h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>Here's your practice overview</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: '16px',
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a73e8' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: '20px',
              textDecoration: 'none',
              color: '#333',
              display: 'block',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{link.label}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{link.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
