// src/pages/Home.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VehicleTypeSidebar from '../components/VehicleTypeSidebar';
import VehicleTypeDrawer from '../components/VehicleTypeDrawer';
import CarCard from '../components/CarCard';
import Pagination from '../components/Pagination';
import bannerImage from '../assets/banner.png';
import { apiPublic } from '../lib/axios';

interface Car {
  ilanBasligi: string;
  ilanNo: string;
  marka: string;
  model: string;
  seri?: string;
  yil: number;
  kilometre: number;
  yakitTipi?: string;
  vitesTipi?: string;
  fiyat: number;
  resimler: { url: string }[];
}

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Liste başlangıcına kaydırmak için referans
  const topRef = useRef<HTMLDivElement>(null);

  // URL'den başlangıç sayfasını oku (ilk render)
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const p = parseInt(sp.get('page') || '1', 10);
    if (!Number.isNaN(p) && p > 0) setPage(p);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // yalnızca ilk yüklemede

  // Sayfa değiştikçe URL'yi güncelle + yukarı kaydır
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const currentUrlPage = parseInt(sp.get('page') || '1', 10);
    if (currentUrlPage !== page) {
      sp.set('page', String(page));
      navigate({ pathname: location.pathname, search: sp.toString() }, { replace: false });
    }

    // Liste üstüne kaydır (navbar varsa yine de güzel çalışır)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [page, location.pathname, location.search, navigate]);

  // Sayfa verisini getir
  useEffect(() => {
    let cancelled = false;
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await apiPublic.get('/cars', { params: { page, limit: 24 } });
        if (cancelled) return;

        if (res.data && Array.isArray(res.data.data)) {
          setCars(res.data.data);
          const tp = Math.max(parseInt(res.data.totalPages || '1', 10), 1);
          setTotalPages(tp);

          // Güvenlik: URL'den büyük bir sayfa girilmişse son sayfaya çek
          if (page > tp) setPage(tp);
        } else {
          setCars([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Araçlar alınamadı:', err);
        setCars([]);
        setTotalPages(1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCars();
    return () => { cancelled = true; };
  }, [page]);

  // onPageChange: sadece state güncelle (scroll & url useEffect’te hallediliyor)
  const handlePageChange = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  // Basit iskelet (loading) grid’i
  const skeletons = useMemo(
    () => new Array(8).fill(0).map((_, i) => (
      <div key={i} className="animate-pulse rounded border p-2">
        <div className="h-32 w-full rounded bg-gray-200" />
        <div className="mt-3 h-3 w-3/4 rounded bg-gray-200" />
        <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
      </div>
    )),
    []
  );

  return (
    <div className="flex px-4 py-6 gap-4 relative max-w-7xl mx-auto">
      {/* Mobil toggle menü butonu */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-yellow-400 text-white px-3 py-2 rounded shadow"
      >
        ☰ Vasıta Türleri
      </button>

      {/* Mobil Drawer */}
      <VehicleTypeDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Masaüstü Sidebar */}
      <aside className="hidden md:block w-64">
        <VehicleTypeSidebar />
      </aside>

      {/* Vitrin */}
      <main className="flex-1 mt-10 md:mt-0 space-y-6">
        {/* Banner Görseli */}
        <div className="w-full">
          <img
            src={bannerImage}
            alt="Güvenoto Banner"
            className="w-full h-auto rounded shadow"
          />
        </div>

        {/* Başlık */}
        <div className="bg-yellow-400 rounded-sm p-1">
          <h1 className="text-center text-black text-3xl">Vasıta Vitrin</h1>
        </div>

        {/* Scroll referansı: her sayfa değişiminde buraya kaydırıyoruz */}
        <div ref={topRef} />

        {/* İçerik */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skeletons}
          </div>
        ) : cars.length === 0 ? (
          <p className="text-center text-red-500">Gösterilecek araç bulunamadı.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {cars.map((car) => (
                <CarCard key={car.ilanNo} car={car} />
              ))}
            </div>

            {/* Sayfalama */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
