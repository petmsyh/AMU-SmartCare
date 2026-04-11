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
    },
    {
      to: '/admin/ratings',
      icon: '⭐',
      title: 'Rating Moderation',
      desc: 'Review and moderate doctor ratings',
      color: '#f4b400',
    },
    {
      to: '/admin/payments',
      icon: '💳',
      title: 'Mock Payment Dashboard',
      desc: 'Manage mock transactions, escrow, and wallets',
      color: '#34a853',
    },
  ];

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, #c62828, #b71c1c)',
          borderRadius: 12,
          padding: '28px 24px',
          color: '#fff',
          marginBottom: 28,
        }}
      >
        <h1 style={{ margin: '0 0 4px', fontSize: 26 }}>Admin Dashboard 🛡️</h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>
          Platform administration and management
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 10,
              padding: 24,
              textDecoration: 'none',
              color: '#333',
              display: 'block',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderTop: `4px solid ${s.color}`,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
            <h3 style={{ margin: '0 0 6px', fontSize: 16, color: s.color }}>{s.title}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: 13 }}>{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
