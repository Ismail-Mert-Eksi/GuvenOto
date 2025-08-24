import React, { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';

interface Props {
  tempFilters: Record<string, string | string[]>;
  setTempFilters: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>;
}

const yakitTipleri = ['Benzin', 'Dizel', 'Elektrik', 'Hybrid', 'LPG'];
const vitesTipleri = ['Manuel', 'Otomatik', 'Yarı Otomatik'];
const kasaTipleri = ['Sedan', 'Hatchback', 'SUV', 'Coupe'];
const renkler = ['Siyah', 'Beyaz', 'Gri', 'Kırmızı', 'Mavi', 'Yeşil','Haki Yeşil', 'Sarı', 'Füme'];

const CheckboxFilter: React.FC<Props> = ({ tempFilters, setTempFilters }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleItem = (key: string, item: string) => {
    const list = Array.isArray(tempFilters[key]) ? [...(tempFilters[key] as string[])] : [];
    setTempFilters((prev) => ({
      ...prev,
      [key]: list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    }));
  };

  const toggleBoolean = (key: string) => {
    setTempFilters((prev) => ({ ...prev, [key]: prev[key] === 'true' ? '' : 'true' }));
  };

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  /* ---------- küçük yapı taşları ---------- */
  const Section: React.FC<{ label: string; name: string; children: React.ReactNode }> = ({
    label,
    name,
    children,
  }) => {
    const open = openSection === name;
    return (
      <div className="rounded-2xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => toggleSection(name)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none"
          aria-expanded={open}
        >
          <span className="normal-case">{label}</span>
          <IoChevronDown className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        <div className={`px-3 pb-3 pt-1 ${open ? 'block' : 'hidden'}`}>{children}</div>
      </div>
    );
  };

  const OptionRow: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({
    label,
    checked,
    onChange,
  }) => (
    <label className="grid grid-cols-[20px,1fr] items-center gap-3 rounded-md px-2 py-1.5 hover:bg-gray-50 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 accent-yellow-500"
      />
      <span className="text-sm text-gray-800 normal-case whitespace-nowrap leading-5">{label}</span>
    </label>
  );

  /* ---------- gruplar ---------- */
  const renderGroup = (label: string, key: string, items: string[]) => (
    <Section label={label} name={key}>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {items.map((item) => (
          <OptionRow
            key={item}
            label={item}
            checked={Array.isArray(tempFilters[key]) && (tempFilters[key] as string[]).includes(item)}
            onChange={() => toggleItem(key, item)}
          />
        ))}
      </div>
    </Section>
  );

  const renderBooleanGroup = () => (
    <Section label="İlan Özellikleri" name="boolean">
      <div className="grid grid-cols-1">
        <OptionRow label="Acil İlan" checked={tempFilters.acil === 'true'} onChange={() => toggleBoolean('acil')} />
        <OptionRow label="Modifiye" checked={tempFilters.modifiye === 'true'} onChange={() => toggleBoolean('modifiye')} />
        <OptionRow label="Klasik" checked={tempFilters.klasik === 'true'} onChange={() => toggleBoolean('klasik')} />
      </div>
    </Section>
  );

  return (
    <div className="text-sm space-y-2">
      {renderGroup('Yakıt Tipi', 'yakitTipi', yakitTipleri)}
      {renderGroup('Vites Tipi', 'vitesTipi', vitesTipleri)}
      {renderGroup('Kasa Tipi', 'kasaTipi', kasaTipleri)}
      {renderGroup('Renk', 'renk', renkler)}
      {renderBooleanGroup()}
    </div>
  );
};

export default CheckboxFilter;
