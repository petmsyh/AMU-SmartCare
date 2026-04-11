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
    { label: 'Total', value: safeConsultations.length, icon: '📋', colorCls: 'text-primary-500 bg-primary-50' },
    { label: 'Pending', value: safeConsultations.filter((c) => c.status === 'pending').length, icon: '⏳', colorCls: 'text-accent-400 bg-accent-50' },
    { label: 'In Progress', value: safeConsultations.filter((c) => c.status === 'in_progress').length, icon: '🔄', colorCls: 'text-purple-500 bg-purple-100' },
    { label: 'Completed', value: safeConsultations.filter((c) => c.status === 'completed').length, icon: '✅', colorCls: 'text-success-500 bg-success-100' },
    { label: 'Wallet', value: `₹${formattedWalletBalance}`, icon: '💰', colorCls: 'text-primary-900 bg-primary-50' },
  ];

  const quickLinks = [
    { to: '/doctor/profile', label: 'Update Profile', desc: 'Edit your doctor profile', icon: '👤', colorCls: 'text-primary-500 bg-primary-50' },
    { to: '/doctor/consultations', label: 'View Consultations', desc: 'Manage patient requests', icon: '📋', colorCls: 'text-success-500 bg-success-100' },
    { to: '/doctor/wallet', label: 'Wallet', desc: 'View earnings & withdraw', icon: '💰', colorCls: 'text-primary-900 bg-primary-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/[0.07]" />
        <div className="relative">
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-70 mb-2">Doctor Portal</div>
          <h1 className="text-3xl font-extrabold mb-1">Welcome, Dr. {user?.username}! 👨‍⚕️</h1>
          <p className="opacity-80 text-sm">Here&apos;s your practice overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mx-auto mb-2.5 ${s.colorCls}`}>
              {s.icon}
            </div>
            <div className="text-xl font-extrabold text-gray-800 leading-none">{s.value}</div>
            <div className="text-[11px] text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to} className="card-hover p-6 block group">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${link.colorCls}`}>
                {link.icon}
              </div>
              <div className="font-bold text-gray-800 text-sm mb-1">{link.label}</div>
              <div className="text-xs text-gray-400 mb-3">{link.desc}</div>
              <div className="text-sm text-primary-500 font-semibold group-hover:text-primary-700 transition-colors">
                Go →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
