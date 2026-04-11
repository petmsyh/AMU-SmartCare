import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const roleHome: Record<Role, string> = {
      patient: '/patient',
      doctor: '/doctor',
      student: '/student',
      admin: '/admin',
    };
    return <Navigate to={roleHome[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
