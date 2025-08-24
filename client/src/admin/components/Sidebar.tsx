// admin/components/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaCar, FaCogs, FaPlus } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // drawer mantığı

  const toggleSidebar = () => setIsOpen(!isOpen);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="md:w-64">
      {/* Mobil buton */}
      <div className="md:hidden p-2">
        <button onClick={toggleSidebar}>
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-white shadow-md h-screen md:block fixed md:relative z-50 transition-all duration-300 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="p-4 text-xl font-bold border-b">Admin Panel</div>
        <nav className="flex flex-col p-2 space-y-2">
  <NavLink to={`/${import.meta.env.VITE_ADMIN_SLUG}/dashboard`} className={linkClass}>
    <FaCar className="mr-2" /> Dashboard
  </NavLink>
  <NavLink to={`/${import.meta.env.VITE_ADMIN_SLUG}/cars`} className={linkClass}>
    <FaCar className="mr-2" /> Araçlar
  </NavLink>
  <NavLink to={`/${import.meta.env.VITE_ADMIN_SLUG}/cars/add`} className={linkClass}>
    <FaPlus className="mr-2" /> Araç Ekle
  </NavLink>
  <NavLink to={`/${import.meta.env.VITE_ADMIN_SLUG}/spare-parts`} className={linkClass}>
    <FaCogs className="mr-2" /> Yedek Parçalar
  </NavLink>
  <NavLink to={`/${import.meta.env.VITE_ADMIN_SLUG}/spare-parts/add`} className={linkClass}>
    <FaPlus className="mr-2" /> Parça Ekle
  </NavLink>
</nav>

      </div>
    </div>
  );
};

export default Sidebar;
