// admin/AdminLayout.tsx
import React from 'react';
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/AdminNavbar';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Sağ kısım (navbar + içerik) */}
      <div className="flex-1 flex flex-col">
        {/* Üst Navbar */}
        <AdminNavbar />

        {/* İçerik */}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
