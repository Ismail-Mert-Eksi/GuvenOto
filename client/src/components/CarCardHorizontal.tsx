import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Car } from '../types/car';

interface Props {
  car: Car;
}

const CarCardHorizontal: React.FC<Props> = ({ car }) => {
  const navigate = useNavigate();

  const image =
    car?.resimler?.[0]?.url ||
    'https://via.placeholder.com/800x600?text=No+Image';

  return (
    <div
      onClick={() => navigate(`/ilan/${car.ilanNo}`)}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white overflow-hidden
                 transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]"
    >
      <div className="flex">
        {/* Sol Resim */}
        <div className="w-[250px] h-[180px] flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={`${car.marka} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Sağ Bilgi Alanı */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          {/* Üst kısım: Marka - Seri - Model */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {car.marka?.toUpperCase()} {car.seri} {car.model}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
              {car.ilanBasligi || 'İlan açıklaması belirtilmemiş'}
            </p>

            {/* Kilometre (üstte) ve Yıl (altta, aralıklı) */}
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-800">
                {formatKM(car.kilometre)}
              </p>
              <p className="text-sm text-gray-700 mt-1 py-2">{car.yil || '-'}</p>
            </div>
          </div>

          {/* Alt kısım: Fiyat ve Tarih */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-red-600 whitespace-nowrap">
              {formatPrice(car.fiyat)} TL
            </span>
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              {formatDate(car.ilanTarihi)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCardHorizontal;

/* ---- yardımcı fonksiyonlar ---- */
function formatKM(v?: number | string) {
  if (v == null) return '-';
  const n = Number(String(v).replace(/\D/g, ''));
  if (Number.isNaN(n)) return '-';
  return `${n.toLocaleString('tr-TR')} KM`;
}

function formatPrice(v?: number | string) {
  if (v == null) return '-';
  const n = Number(v);
  if (Number.isNaN(n)) return '-';
  return n.toLocaleString('tr-TR');
}

function formatDate(iso?: string) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
