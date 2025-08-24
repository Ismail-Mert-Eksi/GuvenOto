// src/pages/SparePartsPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiPublic } from '../lib/axios';
import SparePartCardHorizontal from '../components/SparePartCardHorizontal';
import Pagination from '../components/Pagination';
import type { SparePart } from '../types/sparePart';

const PAGE_SIZE = 10;

const SparePartsPage: React.FC = () => {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [sp, setSp] = useSearchParams();

  // URL paramları
  const sortParam = sp.get('sort') || 'ilanTarihi:desc';
  const [sortField, sortDir] = (sortParam.includes(':') ? sortParam : 'ilanTarihi:desc').split(
    ':'
  ) as ['fiyat' | 'ilanTarihi', 'asc' | 'desc'];
  const page = Math.max(parseInt(sp.get('page') || '1', 10), 1);

  useEffect(() => {
    const fetchParts = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await apiPublic.get('/spareparts', {
          params: {
            page,
            limit: PAGE_SIZE,
            sort: `${sortField}:${sortDir}`,
          },
        });

        const payload = res.data || {};
        const arr: SparePart[] = Array.isArray(payload) ? payload : payload.data || [];
        setParts(arr);

        const t = payload.total ?? arr.length ?? 0;
        setTotal(t);
        setTotalPages(payload.totalPages ?? Math.max(1, Math.ceil(t / PAGE_SIZE)));
      } catch (e) {
        console.error('Yedek parçalar alınamadı:', e);
        setErr('Yedek parçalar alınamadı.');
        setParts([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, [page, sortField, sortDir]);

  const setSort = (field: 'fiyat' | 'ilanTarihi') => {
    // Aynı alana tıklayınca yönü çevir, değişince desc başlat; sayfayı 1'e çek
    const nextDir: 'asc' | 'desc' =
      field === sortField ? (sortDir === 'desc' ? 'asc' : 'desc') : 'desc';
    const next = new URLSearchParams(sp);
    next.set('sort', `${field}:${nextDir}`);
    next.set('page', '1');
    setSp(next, { replace: true });
  };

  const gotoPage = (p: number) => {
    const clamped = Math.min(Math.max(1, p), Math.max(1, totalPages));
    const next = new URLSearchParams(sp);
    next.set('page', String(clamped));
    setSp(next, { replace: true });
  };

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium ${
      active
        ? 'bg-white text-gray-900 shadow ring-1 ring-black/5'
        : 'text-gray-600 hover:text-gray-900'
    }`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Başlık */}
      <h1 className="text-2xl font-bold">Yedek Parçalar</h1>

      {/* Başlığın altında: toplam sonuç + sağda sıralama */}
      <div className="flex items-center justify-between mt-1 mb-4">
        <p className="text-sm text-gray-600">
          Toplam <span className="font-semibold">{total}</span> sonuç bulundu.
        </p>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Sırala:</span>
          <div className="bg-gray-100 rounded-full p-1 flex items-center gap-1">
            <button
              type="button"
              className={pillClass(sortField === 'fiyat')}
              onClick={() => setSort('fiyat')}
            >
              Fiyat {sortField === 'fiyat' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
            </button>
            <button
              type="button"
              className={pillClass(sortField === 'ilanTarihi')}
              onClick={() => setSort('ilanTarihi')}
            >
              İlan Tarihi {sortField === 'ilanTarihi' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[180px] bg-white border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : err ? (
        <p className="text-red-600">{err}</p>
      ) : parts.length === 0 ? (
        <p>Hiç yedek parça bulunamadı.</p>
      ) : (
        <>
          <div className="space-y-4">
            {parts.map((part) => (
              <SparePartCardHorizontal key={part._id} part={part} />
            ))}
          </div>

          {/* Pagination Component */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={gotoPage}
          />
        </>
      )}
    </div>
  );
};

export default SparePartsPage;
