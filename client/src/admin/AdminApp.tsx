// admin/AdminApp.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './AdminLayout';

// Sayfalar
import AdminLoginPage from './pages/AdminLoginPage';
import Dashboard from './pages/Dashboard';
import CarListPage from './pages/CarListPage';
import CarAddPage from './pages/CarAddPage';
import CarEditPage from './pages/CarEditPage';
import SparePartListPage from './pages/SparePartListPage';
import SparePartAddPage from './pages/SparePartAddPage';
import SparePartEditPage from './pages/SparePartEditPage';

const AdminApp: React.FC = () => {
  return (
    <Routes>
      {/* Giriş ekranı */}
      <Route path="login" element={<AdminLoginPage />} />

      {/* Giriş yapıldıysa korunan admin paneli */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cars" element={<CarListPage />} />
        <Route path="cars/add" element={<CarAddPage />} />
        <Route path="cars/edit/:id" element={<CarEditPage />} />
        <Route path="spare-parts" element={<SparePartListPage />} />
        <Route path="spare-parts/add" element={<SparePartAddPage />} />
        <Route path="spare-parts/edit/:id" element={<SparePartEditPage />} />
      </Route>
    </Routes>
  );
};

export default AdminApp;
