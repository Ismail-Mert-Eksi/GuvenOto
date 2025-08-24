import React, { useEffect, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';

interface Props {
  tempFilters: Record<string, string>;
  setTempFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const formatNumber = (key: string, value: string) => {
  const number = Number(value.replace(/\./g, '').replace(/[^0-9]/g, ''));
  if (!number) return '';
  // Yıl için noktalamadan direkt döndür
  if (key.includes('yil')) return number.toString();
  return new Intl.NumberFormat('tr-TR').format(number);
};

const unformatNumber = (value: string) => {
  return value.replace(/\./g, '').replace(/[^0-9]/g, '');
};

const FilterAccordion: React.FC<Props> = ({ tempFilters, setTempFilters }) => {
  const [formattedValues, setFormattedValues] = useState<Record<string, string>>({});
  const [openSection, setOpenSection] = useState<string | null>(null);

  // --- mevcut davranışın aynısı ---
  useEffect(() => {
    const initialFormatted = Object.fromEntries(
      Object.entries(tempFilters).map(([key, val]) => [key, formatNumber(key, val)])
    );
    setFormattedValues(initialFormatted);
  }, [tempFilters]);

  const handleChange = (key: string, value: string) => {
    const raw = unformatNumber(value);
    setFormattedValues((prev) => ({ ...prev, [key]: formatNumber(key, value) }));
    setTempFilters((prev) => ({ ...prev, [key]: raw }));
  };

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const renderRangeInput = (
    label: string,
    minKey: string,
    maxKey: string,
    section: string
  ) => (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-sm font-semibold text-gray-800 hover:bg-gray-50"
        aria-expanded={openSection === section}
      >
        <span className="normal-case">{label}</span>
        <IoChevronDown
          className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${
            openSection === section ? 'rotate-180' : ''
          }`}
        />
      </button>

      {openSection === section && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-3 pb-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 normal-case">Min</label>
            <input
              type="text"
              value={formattedValues[minKey] || ''}
              onChange={(e) => handleChange(minKey, e.target.value)}
              placeholder="min"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-300/40 outline-none"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 normal-case">Max</label>
            <input
              type="text"
              value={formattedValues[maxKey] || ''}
              onChange={(e) => handleChange(maxKey, e.target.value)}
              placeholder="max"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-300/40 outline-none"
              inputMode="numeric"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="text-sm space-y-2">
      {renderRangeInput('Fiyat', 'fiyatMin', 'fiyatMax', 'fiyat')}
      {renderRangeInput('Yıl', 'yilMin', 'yilMax', 'yil')}
      {renderRangeInput('Kilometre', 'kilometreMin', 'kilometreMax', 'kilometre')}
    </div>
  );
};

export default FilterAccordion;
