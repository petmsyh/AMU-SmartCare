import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const sections = [
    {
      to: '/admin/users',
      icon: '👥',
      title: 'User Management',
      desc: 'View, verify, and manage all platform users',
      color: '#1a73e8',
      stat: '—',
      statLabel: 'Total Users',
    },
    {
      to: '/admin/ratings',
      icon: '⭐',
      title: 'Rating Moderation',
      desc: 'Review and moderate doctor ratings',
      color: '#f4b400',
      stat: '—',
      statLabel: 'Pending Reviews',
    },
    {
      to: '/admin/payments',
      icon: '💳',
      title: 'Mock Payment Dashboard',
      desc: 'Manage mock transactions, escrow, and wallets',
      color: '#34a853',
      stat: '—',
      statLabel: 'Transactions',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
          borderRadius: 16,
          padding: '32px 28px',
          color: '#fff',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -40, right: 80, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.75, marginBottom: 8 }}>
            Admin Portal
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800 }}>Admin Dashboard 🛡️</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>
            Platform administration and management
          </p>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            style={{
              background: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: 14,
              padding: '24px',
              textDecoration: 'none',
              color: '#333',
              display: 'block',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s',
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
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${s.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}
              >
                {s.icon}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.stat}</div>
                <div style={{ fontSize: 11, color: '#999' }}>{s.statLabel}</div>
              </div>
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{s.title}</h3>
            <p style={{ margin: 0, color: '#777', fontSize: 13, lineHeight: 1.5 }}>{s.desc}</p>
            <div style={{ marginTop: 16, fontSize: 13, color: s.color, fontWeight: 600 }}>
              Manage → 
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
