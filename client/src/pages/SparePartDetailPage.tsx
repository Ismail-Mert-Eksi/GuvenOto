import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiPublic } from "../lib/axios";
import type { SparePart } from "../types/sparePart";
import ImageGallery from "../components/ImageGallery";
import ContactCard from "../components/ContactCard";
import { FiCalendar, FiEye, FiTag, FiChevronDown, FiChevronUp, FiAperture, FiHash } from "react-icons/fi";

const SparePartDetailPage: React.FC = () => {
  const { ilanNo } = useParams<{ ilanNo: string }>();
  const [part, setPart] = useState<SparePart | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiPublic.get(`/spareparts/ilan/${ilanNo}`);
        setPart(res.data as SparePart);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [ilanNo]);

  const images = (part?.resimler || []).map((r) => r.url).filter(Boolean);

  const chips: string[] = [];
  if (part?.marka) chips.push(part.marka);
  if (part?.ilanNo) chips.push(`#${part.ilanNo}`);

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
    yetkili: "Onur ÖCAL",
    telefonlar: ["0 (506) 776-80-25", "0 (312) 311-25-52"],
    email: "info@guvenoto.com",
    whatsappLink: "https://wa.me/905067768025",
  };

  if (!part) return <div className="max-w-7xl mx-auto px-4 py-10 text-gray-500">Yükleniyor…</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="mb-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          {part.ilanBasligi || "Yedek Parça"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol: Galeri + Açıklama */}
        <div className="md:col-span-2">
          <ImageGallery images={images} intervalMs={5000} />

          <section className="mt-6">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="grid place-items-center w-9 h-9 rounded-lg bg-blue-50 text-blue-700">
                  <FiAperture />
                </span>
                <h2 className="text-lg font-semibold">İlan Detayları</h2>
              </div>

              <div className="relative px-5 py-4">
                {part.ilanDetay ? (
                  <>
                    <div
                      className={`prose prose-sm max-w-none text-gray-800 leading-relaxed transition-all ${
                        expanded ? "" : "max-h-72 overflow-hidden"
                      }`}
                      dangerouslySetInnerHTML={{ __html: part.ilanDetay }}
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

        {/* Sağ: Fiyat + Bilgiler + İletişim */}
        <aside className="space-y-4 md:sticky md:top-6 self-start">
          {/* Fiyat Kartı */}
          <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="bg-white p-5">
              {part.fiyat != null && (
                <div className="text-3xl md:text-4xl font-black tracking-tight text-red-600">
                  {formatPrice(part.fiyat)}{" "}
                  <span className="text-xl font-bold text-red-600 align-super">TL</span>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {part.marka && (
                  <span className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 inline-flex items-center gap-1">
                    <FiTag className="w-4 h-4" />
                    {part.marka}
                  </span>
                )}
                {part.ilanNo && (
                  <span className="px-2 py-1 text-xs rounded-md bg-gray-50 text-gray-700 inline-flex items-center gap-1">
                    <FiHash className="w-4 h-4" />
                    {part.ilanNo}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bilgiler */}
          <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
            <h3 className="text-base font-semibold mb-3">Parça Bilgileri</h3>
            <div className="divide-y divide-gray-100">
              <Row label="Marka" value={part.marka} icon={<FiTag className="w-4 h-4" />} />
              <Row label="İlan No" value={part.ilanNo} icon={<FiHash className="w-4 h-4" />} />
              <Row label="Görüntülenme" value={part.ilanGoruntulenme} icon={<FiEye className="w-4 h-4" />} />
              <Row label="İlan Tarihi" value={formatDate(part.ilanTarihi)} icon={<FiCalendar className="w-4 h-4" />} />
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

export default SparePartDetailPage;

/* ----- helpers ----- */
function formatPrice(v?: number | string) {
  if (v == null) return "-";
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(n)) return "-";
  return n.toLocaleString("tr-TR");
}
function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}
