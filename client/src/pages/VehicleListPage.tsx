// src/pages/VehicleListPage.tsx (şık sıralama barı ile)

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import CarCardHorizontal from '../components/CarCardHorizontal';
import FilterSidebar from '../components/FilterSidebar';
import { apiPublic } from '../lib/axios';

import type { Car } from '../types/car';

/* -------------------- SIRALAMA BİLEŞENİ -------------------- */
const SortBar: React.FC<{
  sort: string;
  onSelect: (value: string) => void;
}> = ({ sort, onSelect }) => {
  const fields = [
    { key: 'fiyat', label: 'Fiyat' },
    { key: 'yil', label: 'Model Yılı' },
    { key: 'kilometre', label: 'KM' },
    { key: 'ilanTarihi', label: 'İlan Tarihi' },
  ];

  const [field, dir] = (sort || 'ilanTarihi:desc').split(':') as [string, 'asc' | 'desc'];
  const toggle = (f: string) => (field === f && dir === 'asc' ? `${f}:desc` : `${f}:asc`);

  return (
    <div className="flex w-full items-center justify-end">
      {/* Mobil: dropdown */}
      <div className="w-full max-w-xs md:hidden">
        <label className="sr-only">Sırala</label>
        <select
          className="w-full rounded-xl border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm"
          value={sort}
          onChange={(e) => onSelect(e.target.value)}
        >
          {fields.flatMap((f) => [
            <option key={`${f.key}:asc`} value={`${f.key}:asc`}>{`${f.label} ↑`}</option>,
            <option key={`${f.key}:desc`} value={`${f.key}:desc`}>{`${f.label} ↓`}</option>,
          ])}
        </select>
      </div>

      {/* Desktop: segmented control */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-sm text-gray-600">Sırala:</span>
        <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-inner">
          {fields.map((f) => {
            const active = field === f.key;
            const arrow = active ? (dir === 'asc' ? '↑' : '↓') : '';
            return (
              <button
                key={f.key}
                onClick={() => onSelect(toggle(f.key))}
                className={`px-3 py-1.5 text-sm rounded-full transition
                  ${
                    active
                      ? 'bg-white text-gray-900 shadow border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                  }`}
                aria-pressed={active}
              >
                {f.label} {arrow}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
/* ----------------------------------------------------------- */

const VehicleListPage = () => {
  const { vehicleType } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState('ilanTarihi:desc');
  const [keyword, setKeyword] = useState('');

  const [hierarchyFilters, setHierarchyFilters] = useState({ marka: '', seri: '', model: '' });
  const [rangeFilters, setRangeFilters] = useState<Record<string, string>>({});
  const [checkboxFilters, setCheckboxFilters] = useState<Record<string, string[] | string>>({});
  const [tempRangeFilters, setTempRangeFilters] = useState<Record<string, string>>({});
  const [tempCheckboxFilters, setTempCheckboxFilters] = useState<Record<string, string[] | string>>({});

  const handleSort = (field: string) => {
    const [currentField, currentOrder] = sort.split(':');
    const newOrder = currentField === field && currentOrder === 'asc' ? 'desc' : 'asc';
    const newSort = `${field}:${newOrder}`;
    setPage(1);
    setSort(newSort);

    const query = new URLSearchParams(searchParams);
    query.set('sort', newSort);
    setSearchParams(query);
  };

  useEffect(() => {
    const urlFilters: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      if (urlFilters[key]) {
        urlFilters[key] = Array.isArray(urlFilters[key])
          ? [...(urlFilters[key] as string[]), value]
          : [urlFilters[key] as string, value];
      } else {
        urlFilters[key] = value;
      }
    });

    setTempRangeFilters({
      fiyatMin: (urlFilters.fiyatMin as string) || '',
      fiyatMax: (urlFilters.fiyatMax as string) || '',
      yilMin: (urlFilters.yilMin as string) || '',
      yilMax: (urlFilters.yilMax as string) || '',
      kilometreMin: (urlFilters.kilometreMin as string) || '',
      kilometreMax: (urlFilters.kilometreMax as string) || '',
    });

    setTempCheckboxFilters({
      yakitTipi: urlFilters.yakitTipi || [],
      vitesTipi: urlFilters.vitesTipi || [],
      kasaTipi: urlFilters.kasaTipi || [],
      renk: urlFilters.renk || [],
      acil: urlFilters.acil || '',
      modifiye: urlFilters.modifiye || '',
      klasik: urlFilters.klasik || '',
    });

    setHierarchyFilters({
      marka: (urlFilters.marka as string) || '',
      seri: (urlFilters.seri as string) || '',
      model: (urlFilters.model as string) || '',
    });

    setRangeFilters({ ...tempRangeFilters });
    setCheckboxFilters({ ...tempCheckboxFilters });

    setKeyword((urlFilters.anahtarKelime as string) || '');
    setSort((urlFilters.sort as string) || 'ilanTarihi:desc');
  }, [searchParams]);

  useEffect(() => {
    const fetchFilteredCars = async () => {
      try {
        setLoading(true);

        const allFilters = {
          page: String(page),
          sort,
          tipi: vehicleType || '',
          anahtarKelime: keyword,
          ...hierarchyFilters,
          ...rangeFilters,
          ...checkboxFilters,
        };

        // İstekleri public instance ile yapıyoruz
        const res = await apiPublic.get('/cars', { params: allFilters });

        if (Array.isArray(res.data.data)) {
          setCars(res.data.data);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.total);
        } else {
          setCars([]);
        }
      } catch (err) {
        console.error('Araçlar alınamadı:', err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCars();
  }, [vehicleType, hierarchyFilters, rangeFilters, checkboxFilters, page, sort, keyword]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setRangeFilters(tempRangeFilters);
    setCheckboxFilters(tempCheckboxFilters);

    const combined = {
      ...tempRangeFilters,
      ...tempCheckboxFilters,
      ...hierarchyFilters,
      sort,
      anahtarKelime: keyword,
      tipi: vehicleType || '',
    };

    const query = new URLSearchParams();
    Object.entries(combined).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v));
      } else if (value) {
        query.set(key, value);
      }
    });

    setSearchParams(query);
  };

  const handleReset = () => {
    setPage(1);
    setRangeFilters({});
    setCheckboxFilters({});
    setTempRangeFilters({});
    setTempCheckboxFilters({});
    setHierarchyFilters({ marka: '', seri: '', model: '' });
    setSort('ilanTarihi:desc');
    setKeyword('');
    setSearchParams({});
  };

  return (
    <div className="flex px-4 py-6 gap-4">
      <FilterSidebar
        vehicleType={vehicleType || ''}
        onBrandFilterChange={(filters) => {
          setPage(1);
          setHierarchyFilters(filters);

          const query = new URLSearchParams(searchParams);
          Object.entries(filters).forEach(([key, value]) => {
            if (value) query.set(key, value);
            else query.delete(key);
          });
          setSearchParams(query);
        }}
        tempRangeFilters={tempRangeFilters}
        setTempRangeFilters={setTempRangeFilters}
        tempCheckboxFilters={tempCheckboxFilters}
        setTempCheckboxFilters={setTempCheckboxFilters}
        onSubmit={handleSearchSubmit}
        onReset={handleReset}
      />

      <main className="flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Toplam <strong>{totalCount}</strong> sonuç bulundu.
          </p>
          {/* ŞIK SIRALAMA BARINI BURADA KULLANIYORUZ */}
          <SortBar
            sort={sort}
            onSelect={(value) => {
              setPage(1);
              setSort(value);
              const q = new URLSearchParams(searchParams);
              q.set('sort', value);
              setSearchParams(q);
            }}
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Yükleniyor...</p>
        ) : cars.length === 0 ? (
          <p className="text-center text-red-500">Uygun araç bulunamadı.</p>
        ) : (
          <div className="space-y-1">
            {cars.map((car) => (
              <CarCardHorizontal key={car._id} car={car} />
            ))}
          </div>
        )}

        <div className="flex flex-col items-center mt-6 gap-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              &lt; Geri
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((num) => num === 1 || num === totalPages || Math.abs(num - page) <= 2)
              .map((num, idx, arr) => (
                <React.Fragment key={num}>
                  {idx > 0 && num !== arr[idx - 1] + 1 && (
                    <span className="px-1 py-1 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 rounded ${
                      page === num
                        ? 'bg-yellow-400 text-white font-bold'
                        : 'bg-white text-blue-600 border border-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              İleri &gt;
            </button>
          </div>

          <p className="text-sm text-gray-700">
            Toplam <strong>{totalPages}</strong> sayfa içerisinde <strong>{page}</strong>. sayfayı görüntülemektesiniz.
          </p>
        </div>
      </main>
    </div>
  );
};

export default VehicleListPage;
