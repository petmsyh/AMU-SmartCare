import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const patientLinks = [
  { to: '/patient', label: 'Dashboard', icon: '🏠' },
  { to: '/patient/doctors', label: 'Find Doctors', icon: '🔍' },
  { to: '/patient/consultations', label: 'My Consultations', icon: '📋' },
  { to: '/patient/ai-assistant', label: 'AI Assistant', icon: '🤖' },
];

const doctorLinks = [
  { to: '/doctor', label: 'Dashboard', icon: '🏠' },
  { to: '/doctor/profile', label: 'My Profile', icon: '👤' },
  { to: '/doctor/consultations', label: 'Consultations', icon: '📋' },
  { to: '/doctor/wallet', label: 'Wallet', icon: '💰' },
];

const studentLinks = [{ to: '/student', label: 'Dashboard', icon: '🎓' }];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/ratings', label: 'Ratings', icon: '⭐' },
  { to: '/admin/payments', label: 'Mock Payments', icon: '💳' },
];

const roleConfig: Record<string, { gradient: string; label: string; badgeCls: string; ringCls: string }> = {
  patient: {
    gradient: 'from-primary-500 to-primary-900',
    label: 'Patient',
    badgeCls: 'bg-primary-50 text-primary-600',
    ringCls: 'ring-primary-200',
  },
  doctor: {
    gradient: 'from-primary-700 to-primary-900',
    label: 'Doctor',
    badgeCls: 'bg-primary-50 text-primary-700',
    ringCls: 'ring-primary-200',
  },
  student: {
    gradient: 'from-purple-500 to-purple-700',
    label: 'Student',
    badgeCls: 'bg-purple-100 text-purple-700',
    ringCls: 'ring-purple-200',
  },
  admin: {
    gradient: 'from-danger-500 to-red-800',
    label: 'Admin',
    badgeCls: 'bg-danger-100 text-danger-700',
    ringCls: 'ring-danger-200',
  },
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getLinksByRole = () => {
    switch (user?.role) {
      case 'patient': return patientLinks;
      case 'doctor':  return doctorLinks;
      case 'student': return studentLinks;
      case 'admin':   return adminLinks;
      default:        return [];
    }
  };

  const links = getLinksByRole();
  const rc = roleConfig[user?.role || ''] || roleConfig.patient;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 h-screen sticky top-0 overflow-y-auto shadow-sidebar z-[200]">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <img src="/amu-logo.svg" alt="AMU" className="w-9 h-9" />
        <div>
          <div className="font-extrabold text-sm text-primary-900 leading-tight">AMU SmartCare</div>
          <div className="text-[10px] text-gray-400 tracking-wide">Arba Minch University</div>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white font-bold text-lg mb-2.5`}>
          {user?.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="font-bold text-sm text-gray-800 truncate mb-1">{user?.username}</div>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${rc.badgeCls}`}>
          {rc.label}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 pb-2">Navigation</div>
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? `bg-primary-50 text-primary-600 font-semibold`
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <span className="text-base leading-none">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 hover:text-gray-700 transition-all"
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[199] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar – desktop always visible, mobile off-canvas */}
      <div className={`fixed inset-y-0 left-0 z-[200] transform transition-transform duration-200 lg:relative lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 h-[60px] flex items-center justify-between sticky top-0 z-[100] shadow-header">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="hidden lg:block text-sm text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${rc.gradient} flex items-center justify-center text-white font-bold text-sm`}>
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-700">{user?.username}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
