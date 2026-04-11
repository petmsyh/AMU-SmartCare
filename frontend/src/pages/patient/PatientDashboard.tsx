import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const PatientDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const cards = [
    { icon: '🔍', title: 'Find Doctors', desc: 'Browse and filter specialists', to: '/patient/doctors', color: '#1a73e8' },
    { icon: '📋', title: 'My Consultations', desc: 'View consultation history', to: '/patient/consultations', color: '#34a853' },
    { icon: '🤖', title: 'AI Assistant', desc: 'Get AI-powered health guidance', to: '/patient/ai-assistant', color: '#9c27b0' },
  ];

  const quickStats = [
    { icon: '📋', label: 'Consultations', value: '—', color: '#1a73e8' },
    { icon: '👨‍⚕️', label: 'Doctors Available', value: '500+', color: '#34a853' },
    { icon: '🤖', label: 'AI Sessions', value: '24/7', color: '#9c27b0' },
  ];

  return (
    <div>
      {/* Hero banner */}
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
        <div style={{ position: 'absolute', bottom: -30, right: 100, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.75, marginBottom: 8 }}>
            Patient Portal
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 800 }}>
            Welcome back, {user?.username}! 👋
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 15 }}>
            What would you like to do today?
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {quickStats.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '18px 16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${s.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>Quick Actions</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: '24px',
              textDecoration: 'none',
              color: '#333',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = '';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${card.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                marginBottom: 14,
              }}
            >
              {card.icon}
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{card.title}</h3>
            <p style={{ margin: '0 0 14px', color: '#666', fontSize: 13, lineHeight: 1.5 }}>{card.desc}</p>
            <div style={{ fontSize: 13, color: card.color, fontWeight: 600 }}>Go → </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
