// src/components/FilterSidebar.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BrandList from './BrandList';
import FilterAccordion from './FilterAccordion';
import CheckboxFilter from './CheckboxFilter';
import { IoClose } from 'react-icons/io5';

interface Props {
  vehicleType: string;
  onBrandFilterChange: (filters: { marka: string; seri: string; model: string }) => void;
  tempRangeFilters: Record<string, string>;
  setTempRangeFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  tempCheckboxFilters: Record<string, string[] | string>;
  setTempCheckboxFilters: React.Dispatch<React.SetStateAction<Record<string, string[] | string>>>;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

/* etiketler */
const LABELS: Record<string, string> = {
  fiyat: 'Fiyat',
  yil: 'Yıl',
  kilometre: 'Kilometre',
  yakitTipi: 'Yakıt',
  vitesTipi: 'Vites',
  kasaTipi: 'Kasa',
  renk: 'Renk',
  acil: 'Acil',
  modifiye: 'Modifiye',
  klasik: 'Klasik',
};
const pretty = (v: string) => v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const FilterSidebar: React.FC<Props> = ({
  vehicleType,
  onBrandFilterChange,
  tempRangeFilters,
  setTempRangeFilters,
  tempCheckboxFilters,
  setTempCheckboxFilters,
  onSubmit,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // onSubmit'in en güncel referansını koru
  const onSubmitRef = useRef(onSubmit);
  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  // chip listesi
  const chips = useMemo(() => {
    const list: { key: string; label: string; value: string }[] = [];
    (['fiyat', 'yil', 'kilometre'] as const).forEach((base) => {
      const min = tempRangeFilters[`${base}Min`];
      const max = tempRangeFilters[`${base}Max`];
      if (min || max) {
        list.push({
          key: `${base}Range`,
          label: LABELS[base],
          value: `${min ? pretty(min) : '—'}–${max ? pretty(max) : '—'}`,
        });
      }
    });
    Object.entries(tempCheckboxFilters).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.filter(Boolean).forEach((item, i) =>
          list.push({ key: `${k}:${i}:${item}`, label: LABELS[k] || k, value: String(item) })
        );
      } else if (v) {
        list.push({ key: `${k}:1`, label: LABELS[k] || k, value: String(v) });
      }
    });
    return list;
  }, [tempRangeFilters, tempCheckboxFilters]);

  // çip sil — state'i güncelle ve bir frame sonra güncel onSubmit'i çağır
  const removeChip = (chipKey: string) => {
    const rangeMatch = chipKey.match(/^(fiyat|yil|kilometre)Range$/);
    if (rangeMatch) {
      const base = rangeMatch[1];
      setTempRangeFilters((p) => ({ ...p, [`${base}Min`]: '', [`${base}Max`]: '' }));
    } else {
      const [k, , rawVal] = chipKey.split(':'); // k:i:val
      const val = rawVal;
      setTempCheckboxFilters((prev) => {
        const cur = prev[k];
        if (Array.isArray(cur)) return { ...prev, [k]: cur.filter((x) => String(x) !== val) };
        return { ...prev, [k]: '' };
      });
    }
    // parent state commit edilsin, sonra en güncel onSubmit ile uygula
    requestAnimationFrame(() => {
      onSubmitRef.current?.({ preventDefault() {} } as unknown as React.FormEvent);
    });
  };

  const handleSubmitAndClose = (e: React.FormEvent) => {
    onSubmit(e);
    setIsOpen(false);
  };
  const handleResetAndClose = () => {
    onReset();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobil: Drawer butonu */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 shadow hover:shadow-md transition"
        aria-label="Filtreleri Aç"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h13M10 18h10" />
        </svg>
        <span className="text-sm text-gray-800">Filtreler</span>
      </button>

      {/* Masaüstü Sidebar */}
      <aside className="hidden lg:flex w-80 max-w-xs filter-panel rounded-2xl border border-gray-200 bg-white shadow-sm sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden flex-col">
        <div className="px-4 py-3 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-gray-900 tracking-wide">Filtreler</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-3 pb-1 space-y-3">
          <div className="rounded-2xl border border-gray-100 p-3">
            <BrandList vehicleType={vehicleType} onFilterChange={onBrandFilterChange} />
          </div>

          {chips.length > 0 && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-2.5">
              <div className="mb-1 text-xs font-semibold text-amber-800 uppercase tracking-wide">Seçili Filtreler</div>
              <div className="flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <span
                    key={c.key}
                    className="group inline-flex items-center gap-1 rounded-full bg-white border border-amber-200 px-2 py-1 text-xs text-gray-800 shadow-sm"
                  >
                    <strong className="font-semibold text-gray-900">{c.label}:</strong> {c.value}
                    <button
                      type="button"
                      onClick={() => removeChip(c.key)}
                      className="ml-0.5 rounded-full p-0.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                      aria-label="Kaldır"
                    >
                      <IoClose size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="rounded-2xl border border-gray-100 p-3">
              <FilterAccordion tempFilters={tempRangeFilters} setTempFilters={setTempRangeFilters} />
            </div>
            <div className="rounded-2xl border border-gray-100 p-3">
              <CheckboxFilter tempFilters={tempCheckboxFilters} setTempFilters={setTempCheckboxFilters} />
            </div>
          </form>
        </div>

        <div className="border-t border-gray-100 bg-white/90 p-2">
          <div className="flex gap-2">
            <button
              onClick={(e) => onSubmit(e as unknown as React.FormEvent)}
              className="flex-1 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 shadow-sm transition"
            >
              Ara
            </button>
            <button
              onClick={onReset}
              type="button"
              className="flex-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 transition"
            >
              Temizle
            </button>
          </div>
        </div>
      </aside>

      {/* Mobil Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl rounded-r-2xl filter-panel flex flex-col overflow-hidden translate-x-0 animate-[slideIn_.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white/70 backdrop-blur-sm">
              <h2 className="text-sm font-semibold text-gray-900 tracking-wide">Filtreler</h2>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" onClick={() => setIsOpen(false)} aria-label="Kapat">
                <IoClose size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pt-3 pb-12 space-y-3">
              <div className="rounded-2xl border border-gray-100 p-3">
                <BrandList vehicleType={vehicleType} onFilterChange={onBrandFilterChange} />
              </div>

              {chips.length > 0 && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-2.5">
                  <div className="mb-1 text-xs font-semibold text-amber-800 uppercase tracking-wide">Seçili Filtreler</div>
                  <div className="flex flex-wrap gap-1.5">
                    {chips.map((c) => (
                      <span
                        key={c.key}
                        className="group inline-flex items-center gap-1 rounded-full bg-white border border-amber-200 px-2 py-1 text-xs text-gray-800 shadow-sm"
                      >
                        <strong className="font-semibold text-gray-900">{c.label}:</strong> {c.value}
                        <button
                          type="button"
                          onClick={() => removeChip(c.key)}
                          className="ml-0.5 rounded-full p-0.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          aria-label="Kaldır"
                        >
                          <IoClose size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitAndClose} className="space-y-3">
                <div className="rounded-2xl border border-gray-100 p-3">
                  <FilterAccordion tempFilters={tempRangeFilters} setTempFilters={setTempRangeFilters} />
                </div>
                <div className="rounded-2xl border border-gray-100 p-3">
                  <CheckboxFilter tempFilters={tempCheckboxFilters} setTempFilters={setTempCheckboxFilters} />
                </div>
              </form>
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white/90 p-2">
              <div className="flex gap-2">
                <button onClick={(e) => handleSubmitAndClose(e)} className="flex-1 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 shadow-sm transition">
                  Ara
                </button>
                <button onClick={handleResetAndClose} type="button" className="flex-1 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 transition">
                  Temizle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(-10%); opacity: .6; } to { transform: translateX(0); opacity: 1; } }
        .filter-panel select,
        .filter-panel input[type="text"],
        .filter-panel input[type="number"],
        .filter-panel input[type="search"],
        .filter-panel input[type="date"] {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          background: #fff;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
          transition: box-shadow .15s ease, border-color .15s ease;
          appearance: none;
          background-image: none;
        }
        .filter-panel select:focus,
        .filter-panel input[type="text"]:focus,
        .filter-panel input[type="number"]:focus,
        .filter-panel input[type="search"]:focus,
        .filter-panel input[type="date"]:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 4px rgb(245 158 11 / 0.15);
        }
        .filter-panel .field-label {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 6px;
          font-weight: 600;
          letter-spacing: .02em;
        }
      `}</style>
    </>
  );
};

export default FilterSidebar;
