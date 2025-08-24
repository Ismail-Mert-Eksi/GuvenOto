// src/components/VehicleTypeSidebar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCar,
  FaTruckMonster,
  FaShuttleVan,
  FaTruckMoving,
  FaBriefcase,
  FaBusAlt,
  FaBus,
  FaMotorcycle,
  FaSnowplow,
  FaTractor,
  FaMapMarkerAlt,
  FaTools,
  FaCogs, // yeni
} from 'react-icons/fa';

const vehicleTypes = [
  { type: 'Otomobil', label: 'Otomobil', icon: <FaCar /> },
  { type: 'Suv', label: 'Arazi SUV Pickup', icon: <FaTruckMonster /> },
  { type: 'Minivan', label: 'Minivan Panelvan', icon: <FaShuttleVan /> },
  { type: 'Kamyon', label: 'Kamyon Kamyonet', icon: <FaTruckMoving /> },
  { type: 'Ticari', label: 'Ticari Araçlar', icon: <FaBriefcase /> },
  { type: 'Hurda', label: 'Hurda', icon: <FaTools /> },
  { type: 'Minibus', label: 'Minibüs', icon: <FaBusAlt /> },
  { type: 'Otobus', label: 'Otobüs', icon: <FaBus /> },
  { type: 'Motosiklet', label: 'Motosiklet', icon: <FaMotorcycle /> },
  { type: 'ATV', label: 'ATV, UTV', icon: <FaSnowplow /> },
  { type: 'Traktor', label: 'Traktör', icon: <FaTractor /> },
  { type: 'Taksi', label: 'Tic. Hat, Plaka', icon: <FaMapMarkerAlt /> },
];

const VehicleTypeSidebar = () => {
  const navigate = useNavigate();

  const handleSelect = (type: string) => {
    navigate(`/vehicles/${type}`);
  };

  return (
    <div className="bg-white rounded-md shadow p-4 space-y-2">
      <h3 className="text-xl font-bold text-gray-700 mb-2"> Vasıtalar</h3>
      <ul className="space-y-2">
        {vehicleTypes.map((item) => (
          <li
            key={item.type}
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-800 hover:text-red-500 text-m font-medium transition-colors"
            onClick={() => handleSelect(item.type)}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}

        {/* Buraya Yedek Parça özel route */}
        <li
          className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-800 hover:text-red-500 text-m font-medium transition-colors"
          onClick={() => navigate('/yedek-parca')}
        >
          <span className="text-lg"><FaCogs /></span>
          <span>Yedek Parça</span>
        </li>
      </ul>
    </div>
  );
};

export default VehicleTypeSidebar;
