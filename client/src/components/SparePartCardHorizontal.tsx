// src/components/SparePartCardHorizontal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SparePart } from '../types/sparePart';

type Props = { part: SparePart };

function formatPrice(v?: number) {
  if (v == null || Number.isNaN(v)) return '';
  return v.toLocaleString('tr-TR');
}

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

const SparePartCardHorizontal: React.FC<Props> = ({ part }) => {
  const navigate = useNavigate();
  const image =
    part?.resimler?.[0]?.url ||
    'https://via.placeholder.com/800x600?text=No+Image';

  const priceText = formatPrice(part.fiyat);
  const dateText = formatDate(part.ilanTarihi);

  const go = () => navigate(`/yedek-parca/${part.ilanNo}`);

  return (
    <div
      onClick={go}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white overflow-hidden
                 transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]"
    >
      <div className="flex max-sm:flex-col">
        {/* Sol görsel */}
        <div className="w-[250px] h-[180px] max-sm:w-full max-sm:h-48 flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={part.ilanBasligi || 'Yedek Parça'}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Sağ bilgi alanı */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* Başlık */}
            <h3 className="text-lg font-bold text-gray-900">
              {part.ilanBasligi || 'Yedek Parça'}
            </h3>

            {/* Marka */}
            {part.marka && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                  {part.marka}
                </span>
              </div>
            )}

            {/* İlan No */}
            {part.ilanNo && (
              <div className="mt-1">
                <span className="text-xs font-semibold text-gray-500">
                  #{part.ilanNo}
                </span>
              </div>
            )}
          </div>

          {/* Alt: Fiyat (sol) + Tarih (sağ) */}
          {(priceText || dateText) && (
            <div className="flex items-center justify-between mt-3">
              {priceText && (
                <span className="text-lg font-bold text-red-600 whitespace-nowrap">
                  {priceText} TL
                </span>
              )}
              {dateText && (
                <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                  {dateText}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SparePartCardHorizontal;
