// admin/components/AdminNavbar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios'; // Yolunu kendi proje yapına göre ayarla

const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "panel-8742";

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate(`/${ADMIN_SLUG}/login`); // ✅ Template literal ile değişken kullanımı
    } catch (error) {
      console.error('Çıkış başarısız', error);
    }
  };

  return (
    <div className="w-full bg-white shadow-md px-4 py-2 flex justify-between items-center">
      <span className="text-lg font-semibold">GüvenOto Admin</span>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">👤 Admin</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Çıkış
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
