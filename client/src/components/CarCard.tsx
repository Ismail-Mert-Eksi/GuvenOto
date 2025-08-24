import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Car {
  ilanBasligi: string;
  ilanNo: string;
  marka: string;
  seri?: string;
  model: string;
  yil: number;
  fiyat: number | null; // <-- null fiyat destekle
  resimler: { url: string }[];
}

interface Props {
  car: Car;
}

const CarCard: React.FC<Props> = ({ car }) => {
  const navigate = useNavigate();
  const { ilanBasligi, ilanNo, marka, seri, model, yil, fiyat, resimler } = car;

  const image =
    resimler?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image';

  // güvenli fiyat formatlayıcı: null/0/NaN => "Fiyat sorunuz"
  const formatPriceTRY = (v: number | null) => {
    if (v == null || !Number.isFinite(v) || v <= 0) return 'Fiyat sorunuz';
    return v.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div
      onClick={() => navigate(`/ilan/${ilanNo}`)}
      className="group cursor-pointer bg-white rounded-sm shadow-sm border hover:shadow-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? navigate(`/ilan/${ilanNo}`) : null)}
    >
      <div className="w-full aspect-[4/3]">
        <img
          src={image}
          alt={`${marka} ${model}${seri ? ' ' + seri : ''}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300">
          {ilanBasligi}
        </h3>

        <p className="text-s font-semibold text-gray-600">{yil}</p>

        <p className="text-blue-600 font-bold text-base">
          {formatPriceTRY(fiyat)}
        </p>
      </div>
    </div>
  );
};

export default CarCard;
