// src/pages/VehicleDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Car } from "../types/car";
import ImageGallery from "../components/ImageGallery";
import ContactCard from "../components/ContactCard";
import { apiPublic } from "../lib/axios";
import {
  FiTag,
  FiCalendar,
  FiEye,
  FiDroplet,
  FiCpu,
  FiZap,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiAperture,
  FiHash,
} from "react-icons/fi";

const VehicleDetailPage = () => {
  const { ilanNo } = useParams<{ ilanNo: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!ilanNo) return;
    (async () => {
      try {
        const res = await apiPublic.get(`/cars/ilan/${encodeURIComponent(ilanNo)}`);
        setCar((res.data?.data ?? res.data) as Car);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [ilanNo]);

  // Hooks bitti — aşağıda sadece normal değişkenler

  // car null iken de güvenli hesaplayalım
  const images = (car?.resimler || []).map((r) => r.url).filter(Boolean);
  const metaChips: string[] = [];
  if (car?.yil) metaChips.push(String(car.yil));
  if (car?.kilometre != null) metaChips.push(`${formatNumber(car.kilometre)} KM`);
  if (car?.renk) metaChips.push(car.renk);

  const Row = ({
    icon,
    label,
    value,
  }: {
    icon?: React.ReactNode;
    label: string;
    value?: React.ReactNode;
  }) =>
    value === undefined || value === null || value === "" ? null : (
      <div className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100">
        <div className="flex items-center gap-2 text-gray-600">
          {icon && <span className="grid place-items-center w-7 h-7 rounded-md bg-gray-50">{icon}</span>}
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-gray-900">{value}</div>
      </div>
    );

  const seller = {
    isim: "Güvenoto",
    yetkili: "Hamza ÖCAL",
    telefonlar: ["0 (506) 776-80-25", "0 (312) 311-25-52"],
    email: "info@guvenoto.com",
    whatsappLink: "https://wa.me/905067768025",
  };

  if (!car)
    return <div className="max-w-7xl mx-auto px-4 py-10 text-gray-500">Yükleniyor…</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="mb-3">
        <h1 className="text-2xl md:text-2xl font-extrabold text-gray-900">
          {car.ilanBasligi || `${car.marka ?? ""} ${car.seri ?? ""} ${car.model ?? ""}`}
        </h1>
        <div className="mt-2 flex flex-wrap gap-2">
          {metaChips.map((c, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol: Galeri + İlan Detay */}
        <div className="md:col-span-2">
          <ImageGallery images={images} intervalMs={5000} />

          {/* İlan Detayları */}
          <section className="mt-6">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="grid place-items-center w-9 h-9 rounded-lg bg-blue-50 text-blue-700">
                  <FiAperture />
                </span>
                <h2 className="text-lg font-semibold">İlan Detayları</h2>
              </div>

              <div className="relative px-5 py-4">
                {car.ilanDetay ? (
                  <>
                    <div
                      className={`prose prose-sm max-w-none text-gray-800 leading-relaxed transition-all ${
                        expanded ? "" : "max-h-72 overflow-hidden"
                      }`}
                      dangerouslySetInnerHTML={{ __html: car.ilanDetay }}
                    />
                    {!expanded && (
                      <div className="pointer-events-none absolute left-0 right-0 bottom-12 h-20 bg-gradient-to-t from-white to-transparent" />
                    )}
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => setExpanded((s) => !s)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium"
                      >
                        {expanded ? (
                          <>
                            <FiChevronUp className="w-4 h-4" /> Daha az göster
                          </>
                        ) : (
                          <>
                            <FiChevronDown className="w-4 h-4" /> Devamını oku
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">İlan açıklaması bulunmamaktadır.</p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sağ: Fiyat + Özellikler + İletişim */}
        <aside className="space-y-4 md:sticky md:top-6 self-start">
          {/* Fiyat Kartı */}
          <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="bg-white p-5">
              <div className="text-3xl md:text-4xl font-black tracking-tight text-red-600">
                {formatPrice(car.fiyat)} <span className="text-xl font-bold text-red-600 align-super">TL</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {car.yil && (
                  <span className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 inline-flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    {car.yil}
                  </span>
                )}
                {car.kilometre != null && (
                  <span className="px-2 py-1 text-xs rounded-md bg-emerald-50 text-emerald-700 inline-flex items-center gap-1">
                    <FiEye className="w-4 h-4 rotate-90" />
                    {formatNumber(car.kilometre)} KM
                  </span>
                )}
                {car.tipi && (
                  <span className="px-2 py-1 text-xs rounded-md bg-amber-50 text-amber-700 inline-flex items-center gap-1">
                    <FiTag className="w-4 h-4" />
                    {car.tipi}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
            <h3 className="text-base font-semibold mb-3">Araç Bilgileri</h3>
            <div className="divide-y divide-gray-100">
              <Row label="İlan No" value={car.ilanNo} icon={<FiHash className="w-4 h-4" />} />
              <Row label="Marka" value={car.marka} icon={<FiTag className="w-4 h-4" />} />
              <Row label="Model" value={car.model} icon={<FiSettings className="w-4 h-4" />} />
              <Row label="Seri" value={car.seri} icon={<FiSettings className="w-4 h-4" />} />
              <Row label="Yıl" value={car.yil} icon={<FiCalendar className="w-4 h-4" />} />
              <Row
                label="Kilometre"
                value={car.kilometre != null ? `${formatNumber(car.kilometre)} KM` : ""}
                icon={<FiEye className="w-4 h-4 rotate-90" />}
              />
              <Row label="Renk" value={car.renk} icon={<FiAperture className="w-4 h-4" />} />
              <Row label="Tipi" value={car.tipi} icon={<FiTag className="w-4 h-4" />} />
              <Row label="Yakıt Tipi" value={car.yakitTipi} icon={<FiDroplet className="w-4 h-4" />} />
              <Row label="Motor Hacmi" value={car.motorHacmi} icon={<FiCpu className="w-4 h-4" />} />
              <Row label="Motor Gücü" value={car.motorGucu} icon={<FiZap className="w-4 h-4" />} />
              <Row label="Vites Tipi" value={car.vitesTipi} icon={<FiSettings className="w-4 h-4" />} />
              <Row label="Görüntülenme" value={(car as any).ilanGoruntulenme} icon={<FiEye className="w-4 h-4" />} />
              <Row label="İlan Tarihi" value={formatDate(car.ilanTarihi)} icon={<FiCalendar className="w-4 h-4" />} />
            </div>
          </div>

          {/* İletişim Kartı */}
          <ContactCard
            isim={seller.isim}
            yetkili={seller.yetkili}
            telefonlar={seller.telefonlar}
            email={seller.email}
            whatsappLink={seller.whatsappLink}
          />
        </aside>
      </div>
    </div>
  );
};

export default VehicleDetailPage;

/* ---------- helpers ---------- */
function formatPrice(v?: number | string) {
  if (v == null) return "-";
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(n)) return "-";
  return n.toLocaleString("tr-TR");
}
function formatNumber(v?: number | string) {
  if (v == null) return "";
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("tr-TR");
}
function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
