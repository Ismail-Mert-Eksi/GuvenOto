// src/components/VehicleTypeDrawer.tsx
import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import VehicleTypeSidebar from './VehicleTypeSidebar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const VehicleTypeDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  // Drawer açıkken body scroll'u kapat
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Arka plan: sadece tıklama alanı, siyah değil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={onClose}
        />
      )}

      {/* Drawer kutusu */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()} // içeriye tıklayınca kapanmasın
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Vasıta Türleri</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 hover:text-black" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          <VehicleTypeSidebar />
        </div>
      </div>
    </>
  );
};

export default VehicleTypeDrawer;
