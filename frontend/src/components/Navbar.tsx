import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-primary-500 text-white px-6 h-14 flex items-center justify-between shadow-md sticky top-0 z-[100]">
      <Link to="/" className="text-white font-bold text-xl no-underline">
        AMU SmartCare
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-white/90">
              {user.username} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-white/20 border border-white/50 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
