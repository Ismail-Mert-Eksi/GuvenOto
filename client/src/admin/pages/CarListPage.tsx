// admin/pages/CarListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../lib/axios';

interface Car {
  _id: string;
  ilanNo: string;
  marka: string;
  model: string;
  yil: number;
  fiyat: number;
  ilanGoruntulenme?: number;
  resimler: { url: string }[];
}

const CarListPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('ilanTarihi:desc'); // Varsayılan
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars', {
        params: { page, sort, anahtarKelime: search },
      });
      setCars(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error('Araçlar getirilemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]); // arama butonla tetikleniyor

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Bu aracı silmek istediğinize emin misiniz?');
    if (!ok) return;

    try {
      await api.delete(`/cars/${id}`);
      toast.success('Araç başarıyla silindi.');
      fetchCars();
    } catch (err) {
      toast.error('Araç silinemedi.');
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCars();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Araç Listesi</h1>

      {/* Search & Sort */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <label htmlFor="search" className="sr-only">Ara</label>
          <input
            id="search"
            name="search"
            type="text"
            placeholder="İlan No, Marka, Model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded w-64"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Ara
          </button>
        </form>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="sr-only">Sırala</label>
          <select
            id="sort"
            name="sort"
            value={sort}
            onChange={handleSortChange}
            className="border px-3 py-1 rounded"
          >
            <option value="">Sıralama Seçin</option>
            <option value="fiyat:asc">Fiyat (Artan)</option>
            <option value="fiyat:desc">Fiyat (Azalan)</option>
            <option value="ilanTarihi:desc">En Yeni</option>
            <option value="ilanTarihi:asc">En Eski</option>
            <option value="ilanNo:asc">İlan No (Artan)</option>
            <option value="ilanNo:desc">İlan No (Azalan)</option>
          </select>
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 text-left">#</th>
              <th className="py-2 px-3 text-left">Görsel</th>
              <th className="py-2 px-3 text-left">İlan No</th>
              <th className="py-2 px-3 text-left">Marka / Model</th>
              <th className="py-2 px-3 text-left">Yıl</th>
              <th className="py-2 px-3 text-left">Fiyat</th>
              <th className="py-2 px-3 text-left">Görüntülenme</th>
              <th className="py-2 px-3 text-left">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Araç bulunamadı.
                </td>
              </tr>
            ) : (
              cars.map((car, index) => (
                <tr key={car._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3">{(page - 1) * 10 + index + 1}</td>
                  <td className="py-2 px-3">
                    <img
                      src={car.resimler?.[0]?.url}
                      alt="araç"
                      className="w-20 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-3">{car.ilanNo}</td>
                  <td className="py-2 px-3">
                    {car.marka} {car.model}
                  </td>
                  <td className="py-2 px-3">{car.yil}</td>
                  <td className="py-2 px-3">
                    {typeof car.fiyat === 'number'
                      ? car.fiyat.toLocaleString('tr-TR')
                      : ''}
                    {typeof car.fiyat === 'number' ? ' ₺' : ''}
                  </td>
                  <td className="py-2 px-3">{car.ilanGoruntulenme ?? 0}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/${import.meta.env.VITE_ADMIN_SLUG}/cars/edit/${car._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="text-red-600 hover:underline"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {loading && <div className="mt-3 text-sm text-gray-500">Yükleniyor...</div>}
    </div>
  );
};

export default CarListPage;
