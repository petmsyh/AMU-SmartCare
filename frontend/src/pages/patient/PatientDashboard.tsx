import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const PatientDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const cards = [
    { icon: '🔍', title: 'Find Doctors', desc: 'Browse and filter specialists', to: '/patient/doctors', colorCls: 'text-primary-500 bg-primary-50' },
    { icon: '📋', title: 'My Consultations', desc: 'View consultation history', to: '/patient/consultations', colorCls: 'text-success-500 bg-success-100' },
    { icon: '🤖', title: 'AI Assistant', desc: 'Get AI-powered health guidance', to: '/patient/ai-assistant', colorCls: 'text-purple-500 bg-purple-100' },
  ];

  const quickStats = [
    { icon: '📋', label: 'Consultations', value: '—', colorCls: 'text-primary-500 bg-primary-50' },
    { icon: '👨‍⚕️', label: 'Doctors Available', value: '500+', colorCls: 'text-success-500 bg-success-100' },
    { icon: '🤖', label: 'AI Sessions', value: '24/7', colorCls: 'text-purple-500 bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/[0.07]" />
        <div className="absolute -bottom-8 right-24 w-28 h-28 rounded-full bg-white/[0.05]" />
        <div className="relative">
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-70 mb-2">Patient Portal</div>
          <h1 className="text-3xl font-extrabold mb-1">Welcome back, {user?.username}! 👋</h1>
          <p className="opacity-80 text-sm">What would you like to do today?</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.colorCls}`}>{s.icon}</div>
            <div>
              <div className="text-xl font-extrabold text-gray-800 leading-none">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link key={card.to} to={card.to} className="card-hover p-6 block group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${card.colorCls}`}>
                {card.icon}
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1.5">{card.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{card.desc}</p>
              <span className="text-sm font-semibold text-primary-500 group-hover:text-primary-700 transition-colors">
                Go →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
