// src/components/SparePartCard.tsx
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

const SparePartCard: React.FC<Props> = ({ part }) => {
  const navigate = useNavigate();
  const coverUrl = part.resimler?.[0]?.url || '/placeholder.jpg';
  const title = part.ilanBasligi || 'Yedek Parça';
  const priceText = formatPrice(part.fiyat);
  const dateText = formatDate(part.ilanTarihi);

  const goDetail = () => navigate(`/yedek-parca/${part.ilanNo}`);

  return (
    <article
      onClick={goDetail}
      onKeyDown={(e) => (e.key === 'Enter' ? goDetail() : undefined)}
      tabIndex={0}
      className="cursor-pointer select-none bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
      aria-label={title}
    >
      {/* Görsel */}
      <div className="w-full aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={coverUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* İçerik */}
      <div className="p-4 space-y-2">
        {/* Başlık */}
        <h3 className="text-base font-semibold leading-snug line-clamp-2">{title}</h3>

        {/* Marka + İlanNo */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {part.marka && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {part.marka}
            </span>
          )}
          {part.ilanNo && (
            <span className="ml-auto text-[11px] text-gray-400">#{part.ilanNo}</span>
          )}
        </div>

        {/* Fiyat + Tarih aynı hizada */}
        {(priceText || dateText) && (
          <div className="flex items-center justify-between pt-1">
            {priceText && (
              <span className="text-red-600 font-bold text-sm whitespace-nowrap">
                {priceText} TL
              </span>
            )}
            {dateText && (
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {dateText}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default SparePartCard;
