import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/Layouts/PublicLayout';
// import AdminLayout from './components/Layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoute';
import ScrollToTop from './components/ScrollTop/ScrollTop';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HomePage from './pages/public/HomePage';
import CustomToast from './components/Toast/CustomToast';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <CustomToast />
        <Routes>
        {/* Public Routes - Home page and contact accessible to everyone */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        
        {/* User Routes - Protected for regular users */}
        <Route path="/" element={
          <ProtectedRoute requiredRole="user">
            <PublicLayout />
          </ProtectedRoute>
        }>
        </Route>
        
        {/* Admin Routes - Protected for admin users */}
        {/* <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
        </Route> */}
        
        {/* Auth Routes (without layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 404 Route */}
        <Route path="*" element={<div className="p-8 text-white min-h-screen bg-[#01161e] flex items-center justify-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;