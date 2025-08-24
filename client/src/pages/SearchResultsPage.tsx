// src/pages/SearchResultsPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiPublic } from '../lib/axios';
import CarCardHorizontal from '../components/CarCardHorizontal';
import SparePartCardHorizontal from '../components/SparePartCardHorizontal';
import Pagination from '../components/Pagination';
import type { Car } from '../types/car';
import type { SparePart } from '../types/sparePart';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const anahtarKelime = (searchParams.get('anahtarKelime') || '').trim();

  // --- Cars state ---
  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [carPage, setCarPage] = useState(1);
  const CAR_LIMIT = 12;
  const [carTotalPages, setCarTotalPages] = useState(1);
  const [carTotalCount, setCarTotalCount] = useState(0);

  // --- Spare parts state ---
  const [parts, setParts] = useState<SparePart[]>([]);
  const [partsLoading, setPartsLoading] = useState(true);
  const [partPage, setPartPage] = useState(1);
  const PART_LIMIT = 12;
  const [partTotalPages, setPartTotalPages] = useState(1);
  const [partTotalCount, setPartTotalCount] = useState(0);

  // Keyword değişince iki sayfayı da 1'e çek
  useEffect(() => {
    setCarPage(1);
    setPartPage(1);
  }, [anahtarKelime]);

  // --- Fetch cars ---
  useEffect(() => {
    let cancelled = false;

    const fetchCars = async () => {
      if (!anahtarKelime) {
        setCars([]);
        setCarTotalPages(1);
        setCarTotalCount(0);
        setCarsLoading(false);
        return;
      }
      setCarsLoading(true);
      try {
        const res = await apiPublic.get('/cars', {
          params: { anahtarKelime, page: carPage, limit: CAR_LIMIT, sort: 'ilanTarihi:desc' },
        });
        if (cancelled) return;

        const payload = res.data ?? {};
        const arr: Car[] = Array.isArray(payload) ? payload : (payload.data ?? []);
        const total = payload.total ?? payload.totalCount ?? 0;
        const totalPages =
          payload.totalPages ?? (total ? Math.max(1, Math.ceil(total / CAR_LIMIT)) : 1);

        setCars(arr);
        setCarTotalPages(totalPages);
        setCarTotalCount(total || arr.length);
      } catch (err) {
        console.error('Araç arama hatası:', err);
        if (!cancelled) {
          setCars([]);
          setCarTotalPages(1);
          setCarTotalCount(0);
        }
      } finally {
        if (!cancelled) setCarsLoading(false);
      }
    };

    fetchCars();
    return () => {
      cancelled = true;
    };
  }, [anahtarKelime, carPage]);

  // --- Fetch spare parts ---
  useEffect(() => {
    let cancelled = false;

    const fetchParts = async () => {
      if (!anahtarKelime) {
        setParts([]);
        setPartTotalPages(1);
        setPartTotalCount(0);
        setPartsLoading(false);
        return;
      }
      setPartsLoading(true);
      try {
        // not: spareparts endpoint’i "search" paramı bekliyor
        const res = await apiPublic.get('/spareparts', {
          params: { search: anahtarKelime, page: partPage, limit: PART_LIMIT, sort: 'ilanTarihi:desc' },
        });
        if (cancelled) return;

        const payload = res.data ?? {};
        const arr: SparePart[] = Array.isArray(payload) ? payload : (payload.data ?? []);
        const total = payload.total ?? payload.totalCount ?? 0;
        const totalPages =
          payload.totalPages ?? (total ? Math.max(1, Math.ceil(total / PART_LIMIT)) : 1);

        setParts(arr);
        setPartTotalPages(totalPages);
        setPartTotalCount(total || arr.length);
      } catch (err) {
        console.error('Parça arama hatası:', err);
        if (!cancelled) {
          setParts([]);
          setPartTotalPages(1);
          setPartTotalCount(0);
        }
      } finally {
        if (!cancelled) setPartsLoading(false);
      }
    };

    fetchParts();
    return () => {
      cancelled = true;
    };
  }, [anahtarKelime, partPage]);

  const loading = carsLoading || partsLoading;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">“{anahtarKelime || '—'}” için sonuçlar</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : cars.length === 0 && parts.length === 0 ? (
        <p>Sonuç bulunamadı.</p>
      ) : (
        <div className="space-y-10">
          {/* Araçlar */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Araçlar</h3>
              <span className="text-sm text-gray-500">
                {carTotalCount || cars.length} sonuç
              </span>
            </div>

            {cars.length === 0 ? (
              <p className="text-sm text-gray-500">Araç bulunamadı.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {cars.map((car) => (
                    <CarCardHorizontal key={(car as any)._id ?? car.ilanNo} car={car} />
                  ))}
                </div>
                <Pagination
                  currentPage={carPage}
                  totalPages={carTotalPages}
                  onPageChange={(p) => setCarPage(p)}
                />
              </>
            )}
          </section>

          {/* Yedek Parçalar */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Yedek Parçalar</h3>
              <span className="text-sm text-gray-500">
                {partTotalCount || parts.length} sonuç
              </span>
            </div>

            {parts.length === 0 ? (
              <p className="text-sm text-gray-500">Yedek parça bulunamadı.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {parts.map((part) => (
                    <SparePartCardHorizontal key={part._id} part={part} />
                  ))}
                </div>
                <Pagination
                  currentPage={partPage}
                  totalPages={partTotalPages}
                  onPageChange={(p) => setPartPage(p)}
                />
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
