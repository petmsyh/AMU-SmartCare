import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { fetchMe } from './store/slices/authSlice';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';

import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorList from './pages/patient/DoctorList';
import DoctorProfile from './pages/patient/DoctorProfile';
import BookConsultation from './pages/patient/BookConsultation';
import PatientConsultations from './pages/patient/PatientConsultations';
import PatientConsultationDetail from './pages/patient/ConsultationDetail';
import AIAssistant from './pages/patient/AIAssistant';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfileForm from './pages/doctor/DoctorProfileForm';
import DoctorConsultations from './pages/doctor/DoctorConsultations';
import DoctorConsultationDetail from './pages/doctor/ConsultationDetail';
import DoctorWallet from './pages/doctor/DoctorWallet';

import StudentDashboard from './pages/student/StudentDashboard';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRatings from './pages/admin/AdminRatings';
import MockPaymentDashboard from './pages/admin/MockPaymentDashboard';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [token, user, dispatch]);

  const defaultRoute = () => {
    if (!token) return <Navigate to="/login" replace />;
    if (!user) return <div style={{ padding: 20, color: '#666' }}>Loading…</div>;
    const routes: Record<string, string> = {
      patient: '/patient',
      doctor: '/doctor',
      student: '/student',
      admin: '/admin',
    };
    return <Navigate to={routes[user.role] || '/login'} replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout>
                <PatientDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout>
                <DoctorList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors/:id"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout>
                <DoctorProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book/:doctorId"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout>
                <BookConsultation />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/consultations"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout>
                <PatientConsultations />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/consultations/:id"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout>
                <PatientConsultationDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/ai-assistant"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout>
                <AIAssistant />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout>
                <DoctorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout>
                <DoctorProfileForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/consultations"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout>
                <DoctorConsultations />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/consultations/:id"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout>
                <DoctorConsultationDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/wallet"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <Layout>
                <DoctorWallet />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminUsers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ratings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminRatings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <MockPaymentDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={defaultRoute()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
