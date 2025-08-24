// src/admin/pages/SparePartListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { api } from '../../lib/axios';

interface SparePart {
  _id: string;
  ilanNo: string;
  ilanBasligi: string;
  fiyat?: number;
  marka?: string;
  ilanGoruntulenme?: number;
  resimler: { url: string }[];
}

interface SparePartListResponse {
  data: SparePart[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const SparePartListPage: React.FC = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [search, setSearch] = useState('');
  // Backend whitelist: ilanTarihi | fiyat | ilanNo
  const [sort, setSort] = useState<'ilanTarihi:desc' | 'ilanTarihi:asc' | 'ilanNo:asc' | 'ilanNo:desc' | 'fiyat:asc' | 'fiyat:desc'>('ilanTarihi:desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSpareParts = async () => {
    try {
      const { data } = await api.get<SparePartListResponse>('/spareparts', {
        params: { page, search, sort },
      });
      setSpareParts(data.data);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Yedek parçalar getirilemedi');
    }
  };

  useEffect(() => {
    fetchSpareParts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, sort]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu yedek parçayı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/spare-parts/by-id/${id}`);
      toast.success('Yedek parça silindi');
      fetchSpareParts();
    } catch {
      toast.error('Silme işlemi başarısız');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Yedek Parça Listesi</h2>

      <div className="flex items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Ara..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
        <select
          className="border px-3 py-2 rounded"
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value as typeof sort);
          }}
        >
          <option value="ilanTarihi:desc">Tarihe Göre (Yeni → Eski)</option>
          <option value="ilanTarihi:asc">Tarihe Göre (Eski → Yeni)</option>
          <option value="ilanNo:asc">İlan No (Artan)</option>
          <option value="ilanNo:desc">İlan No (Azalan)</option>
          <option value="fiyat:asc">Fiyat (Artan)</option>
          <option value="fiyat:desc">Fiyat (Azalan)</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border w-24">Görsel</th>
              <th className="p-2 border">İlan No</th>
              <th className="p-2 border">Başlık</th>
              <th className="p-2 border">Marka</th>
              <th className="p-2 border">Görüntülenme</th>
              <th className="p-2 border">Fiyat</th>
              <th className="p-2 border w-32">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {spareParts.map((item) => (
              <tr key={item._id} className="text-center">
                <td className="p-2 border">
                  {item.resimler?.[0]?.url ? (
                    <img
                      src={item.resimler[0].url}
                      alt="görsel"
                      loading="lazy"
                      className="w-16 h-12 object-cover mx-auto rounded"
                    />
                  ) : (
                    <div className="w-16 h-12 mx-auto rounded bg-gray-100" />
                  )}
                </td>
                <td className="p-2 border">{item.ilanNo}</td>
                <td className="p-2 border">{item.ilanBasligi}</td>
                <td className="p-2 border">{item.marka || '-'}</td>
                <td className="p-2 border">{item.ilanGoruntulenme ?? 0}</td>
                <td className="p-2 border">
                  {typeof item.fiyat === 'number'
                    ? `${item.fiyat.toLocaleString('tr-TR')} TL`
                    : '-'}
                </td>
                <td className="p-2 border">
                  <div className="flex justify-center gap-4">
                    <Link to={`/${import.meta.env.VITE_ADMIN_SLUG}/spareparts/edit/${item._id}`} className="text-blue-600">
                      <FaEdit />
                    </Link>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {spareParts.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={7}>
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-600 text-white' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SparePartListPage;
