// src/admin/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { api } from '../../lib/axios';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, Legend,
} from "recharts";

type ShortCar = {
  _id: string;
  ilanNo: string;
  ilanBasligi: string;
  marka?: string;
  fiyat?: number;
  ilanTarihi?: string;
  ilanGoruntulenme?: number;
  resimler?: { url: string }[];
};

type TopMarka = { marka: string; adet: number; ortFiyat: number };
type DistYakıt = { yakitTipi: string; adet: number };
type DistVites = { vitesTipi: string; adet: number };
type Hist = { _id: any; aralik: string; adet: number };

interface DashboardStats {
  toplamIlan: number;
  bugunEklenen: number;
  son7GunEklenen: number;
  toplamGoruntulenme: number;
  fiyat: { toplam: number; ort: number; min: number; max: number };
  topMarkalar: TopMarka[];
  yakitDagilimi: DistYakıt[];
  vitesDagilimi: DistVites[];
  enCokGoruntulenen: ShortCar[];
  sonIlk5: ShortCar[];
  fiyatHistogram: Hist[];
}

const num = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("tr-TR") : "-";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<DashboardStats>("/statistics");
        setStats(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Yükleniyor...</div>;
  if (!stats) return <div className="p-6">İstatistik bulunamadı.</div>;

  // Grafik veri hazırlıkları
  const yakitData = stats.yakitDagilimi.map((y) => ({
    name: y.yakitTipi,
    adet: y.adet,
  }));
  const vitesData = stats.vitesDagilimi.map((v) => ({
    name: v.vitesTipi,
    adet: v.adet,
  }));
  const histData = stats.fiyatHistogram.map((b) => ({
    name: typeof b._id === "string" ? b._id : b.aralik,
    adet: b.adet,
  }));
  const topMarkaData = stats.topMarkalar.map((m) => ({
    name: m.marka,
    adet: m.adet,
    ort: Math.round(m.ortFiyat || 0),
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Hızlı Erişim (üstte) */}
      <div className="p-6 space-y-6">
  {/* Hızlı Erişim (üstte) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <Link
      to={`/${import.meta.env.VITE_ADMIN_SLUG}/cars/add`}
      className="bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-xl shadow transition"
    >
      ➕ Araç Ekle
    </Link>
    <Link
      to={`/${import.meta.env.VITE_ADMIN_SLUG}/spareparts/add`}
      className="bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-xl shadow transition"
    >
      ➕ Yedek Parça Ekle
    </Link>
    <Link
      to={`/${import.meta.env.VITE_ADMIN_SLUG}/cars`}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-center py-3 rounded-xl shadow transition"
    >
      📋 Araç Listesi
    </Link>
    <Link
      to={`/${import.meta.env.VITE_ADMIN_SLUG}/spareparts`}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-center py-3 rounded-xl shadow transition"
    >
      🧰 Yedek Parça Listesi
    </Link>
  </div>
</div>


      {/* Üst Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500">Toplam İlan</p>
          <p className="text-2xl font-bold text-indigo-600">{num(stats.toplamIlan)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500">Bugün Eklenen</p>
          <p className="text-2xl font-bold text-indigo-600">{num(stats.bugunEklenen)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500">Son 7 Gün</p>
          <p className="text-2xl font-bold text-indigo-600">{num(stats.son7GunEklenen)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500">Toplam Görüntülenme</p>
          <p className="text-2xl font-bold text-indigo-600">{num(stats.toplamGoruntulenme)}</p>
        </div>
      </div>

      {/* Fiyat İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500">Toplam Fiyat</p>
          <p className="text-xl font-semibold">{num(stats.fiyat.toplam)} TL</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500">Ortalama Fiyat</p>
          <p className="text-xl font-semibold">{num(Math.round(stats.fiyat.ort))} TL</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Min</p>
            <p className="text-lg font-semibold">{num(stats.fiyat.min)} TL</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Max</p>
            <p className="text-lg font-semibold">{num(stats.fiyat.max)} TL</p>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top Markalar (Bar) */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="font-semibold mb-3">Top 5 Marka</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMarkaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="adet" name="Adet" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Ortalama fiyatlar:{" "}
            {topMarkaData.map((m) => (
              <span key={m.name} className="mr-3">
                {m.name}: {num(m.ort)} TL
              </span>
            ))}
          </div>
        </div>

        {/* Yakıt Dağılımı (Bar) */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="font-semibold mb-3">Yakıt Dağılımı</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yakitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="adet" name="Adet" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vites Dağılımı (Bar) */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="font-semibold mb-3">Vites Dağılımı</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vitesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="adet" name="Adet" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fiyat Histogramı (Area) */}
      <div className="bg-white rounded-xl shadow p-4">
        <p className="font-semibold mb-3">Fiyat Dağılımı</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={histData}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopOpacity={0.35} />
                  <stop offset="100%" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="adet" name="Adet" strokeOpacity={0.9} fill="url(#areaFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Listeler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="font-semibold mb-3">En Çok Görüntülenen 5 İlan</p>
          <div className="divide-y">
            {stats.enCokGoruntulenen.map((c) => (
              <Link
                to={`/admin/cars/edit/${c._id}`}
                key={c._id}
                className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded"
              >
                <img
                  src={c.resimler?.[0]?.url}
                  alt=""
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {c.marka} • {c.ilanBasligi}
                  </div>
                  <div className="text-xs text-gray-500">
                    Görüntülenme: {num(c.ilanGoruntulenme)}
                  </div>
                </div>
                <div className="text-sm">
                  {c.fiyat ? `${num(c.fiyat)} TL` : "-"}
                </div>
              </Link>
            ))}
            {stats.enCokGoruntulenen.length === 0 && (
              <div className="text-gray-500 text-sm py-2">Veri yok</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="font-semibold mb-3">Son Eklenen 5 İlan</p>
          <div className="divide-y">
            {stats.sonIlk5.map((c) => (
              <Link
                to={`/admin/cars/edit/${c._id}`}
                key={c._id}
                className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded"
              >
                <img
                  src={c.resimler?.[0]?.url}
                  alt=""
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {c.marka} • {c.ilanBasligi}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.ilanTarihi
                      ? format(new Date(c.ilanTarihi), "dd.MM.yyyy")
                      : "-"}
                  </div>
                </div>
                <div className="text-sm">
                  {c.fiyat ? `${num(c.fiyat)} TL` : "-"}
                </div>
              </Link>
            ))}
            {stats.sonIlk5.length === 0 && (
              <div className="text-gray-500 text-sm py-2">Veri yok</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
