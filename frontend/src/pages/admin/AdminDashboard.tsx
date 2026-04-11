import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    to: '/admin/users',
    icon: '👥',
    title: 'User Management',
    desc: 'View, verify, and manage all platform users',
    iconBg: 'bg-primary-50',
    statColor: 'text-primary-500',
    linkColor: 'text-primary-500',
    stat: '—',
    statLabel: 'Total Users',
  },
  {
    to: '/admin/ratings',
    icon: '⭐',
    title: 'Rating Moderation',
    desc: 'Review and moderate doctor ratings',
    iconBg: 'bg-accent-50',
    statColor: 'text-accent-400',
    linkColor: 'text-accent-400',
    stat: '—',
    statLabel: 'Pending Reviews',
  },
  {
    to: '/admin/payments',
    icon: '💳',
    title: 'Mock Payment Dashboard',
    desc: 'Manage mock transactions, escrow, and wallets',
    iconBg: 'bg-success-100',
    statColor: 'text-success-500',
    linkColor: 'text-success-500',
    stat: '—',
    statLabel: 'Transactions',
  },
];

const AdminDashboard: React.FC = () => {
  return (
    <div>
      {/* Hero */}
      <div className="relative mb-7 overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 to-red-900 px-7 py-8 text-white">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/[0.07]" />
        <div className="absolute -bottom-10 right-20 h-28 w-28 rounded-full bg-white/[0.05]" />
        <div className="relative">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest opacity-75">
            Admin Portal
          </div>
          <h1 className="mb-1.5 text-3xl font-extrabold">Admin Dashboard 🛡️</h1>
          <p className="m-0 text-sm opacity-85">
            Platform administration and management
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="card-hover block p-6 no-underline"
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${s.iconBg}`}
              >
                {s.icon}
              </div>
              <div className="text-right">
                <div className={`text-2xl font-extrabold ${s.statColor}`}>
                  {s.stat}
                </div>
                <div className="text-xs text-gray-400">{s.statLabel}</div>
              </div>
            </div>
            <h3 className="mb-1.5 text-base font-bold text-gray-900">
              {s.title}
            </h3>
            <p className="m-0 text-sm leading-relaxed text-gray-500">{s.desc}</p>
            <div className={`mt-4 text-sm font-semibold ${s.linkColor}`}>
              Manage →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
