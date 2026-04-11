import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const PatientDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const cards = [
    { icon: '🔍', title: 'Find Doctors', desc: 'Browse and filter specialists', to: '/patient/doctors' },
    { icon: '📋', title: 'My Consultations', desc: 'View consultation history', to: '/patient/consultations' },
    { icon: '🤖', title: 'AI Assistant', desc: 'Get AI-powered health guidance', to: '/patient/ai-assistant' },
  ];

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
          borderRadius: 12,
          padding: '32px 28px',
          color: '#fff',
          marginBottom: 28,
        }}
      >
        <h1 style={{ margin: '0 0 8px', fontSize: 28 }}>
          Welcome back, {user?.username}! 👋
        </h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: 15 }}>
          What would you like to do today?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: 24,
              textDecoration: 'none',
              color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e0e0e0',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = '';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>{card.icon}</div>
            <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>{card.title}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: 13 }}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
