// src/components/BrandList.tsx
import { useEffect, useState } from 'react';
import { FaSquareFull } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { apiPublic } from '../lib/axios'; // <-- public instance

interface Props {
  vehicleType: string;
  onFilterChange: (filters: { marka: string; seri: string; model: string }) => void;
}

type BrandItem = { name: string; count: number };

const slugify = (raw?: string) => {
  const str = (raw ?? '').toString().trim();
  if (!str) return '';
  return str
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const BrandList = ({ vehicleType, onFilterChange }: Props) => {
  const [brandCounts, setBrandCounts] = useState<BrandItem[]>([]);
  const [selectedMarka, setSelectedMarka] = useState('');
  const [seriler, setSeriler] = useState<string[]>([]);
  const [selectedSeri, setSelectedSeri] = useState('');
  const [modeller, setModeller] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedMarka('');
    setSelectedSeri('');
    setSelectedModel('');
    setSeriler([]);
    setModeller([]);
  }, [vehicleType]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await apiPublic.get('/cars/filters/marka-sayilari', {
          params: { vehicleType },
        });
        setBrandCounts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Markalar alınamadı:', err);
        setBrandCounts([]);
      }
    };
    fetchBrands();
  }, [vehicleType]);

  useEffect(() => {
    const fetchSeriler = async () => {
      if (!selectedMarka) {
        setSeriler([]);
        setSelectedSeri('');
        setModeller([]);
        setSelectedModel('');
        return;
      }
      try {
        const res = await apiPublic.get('/cars/filters/seriler', {
          params: { marka: selectedMarka, vehicleType },
        });
        setSeriler(Array.isArray(res.data) ? res.data : []);
        setSelectedSeri('');
        setModeller([]);
        setSelectedModel('');
      } catch (err) {
        console.error('Seriler alınamadı:', err);
        setSeriler([]);
        setSelectedSeri('');
        setModeller([]);
        setSelectedModel('');
      }
    };
    fetchSeriler();
  }, [selectedMarka, vehicleType]);

  useEffect(() => {
    const fetchModeller = async () => {
      if (!selectedMarka || !selectedSeri) {
        setModeller([]);
        setSelectedModel('');
        return;
      }
      try {
        const res = await apiPublic.get('/cars/filters/modeller', {
          params: { marka: selectedMarka, seri: selectedSeri, vehicleType },
        });
        setModeller(Array.isArray(res.data) ? res.data : []);
        setSelectedModel('');
      } catch (err) {
        console.error('Modeller alınamadı:', err);
        setModeller([]);
        setSelectedModel('');
      }
    };
    fetchModeller();
  }, [selectedSeri, selectedMarka, vehicleType]);

  const handleChange = (type: 'marka' | 'seri' | 'model', value: string) => {
    if (type === 'marka') {
      setSelectedMarka(value);
      setSelectedSeri('');
      setSelectedModel('');
      onFilterChange({ marka: value, seri: '', model: '' });
    } else if (type === 'seri') {
      setSelectedSeri(value);
      setSelectedModel('');
      onFilterChange({ marka: selectedMarka, seri: value, model: '' });
    } else {
      setSelectedModel(value);
      onFilterChange({ marka: selectedMarka, seri: selectedSeri, model: value });
    }
  };

  const clearFiltersAndGoHome = () => {
    setSelectedMarka('');
    setSelectedSeri('');
    setSelectedModel('');
    setSeriler([]);
    setModeller([]);
    onFilterChange({ marka: '', seri: '', model: '' });
    navigate('/');
  };

  const clearMarkaFilter = () => {
    setSelectedMarka('');
    setSelectedSeri('');
    setSelectedModel('');
    setSeriler([]);
    setModeller([]);
    onFilterChange({ marka: '', seri: '', model: '' });
  };

  return (
    <div className="space-y-2 pr-1 mb-2 max-h-96 md:max-h-[400px] overflow-y-auto overscroll-contain">
      <div className="font-bold bg-yellow-400 text-black px-4 py-2 rounded w-full text-left select-none">
        <span className="cursor-pointer hover:underline" onClick={clearFiltersAndGoHome}>
          &lt; Vasıtalar
        </span>
      </div>

      <h3
        className="text-lg font-semibold mb-2 cursor-pointer"
        onClick={clearMarkaFilter}
        title="Filtreleri temizle"
      >
        {vehicleType}
      </h3>

      <ul className="space-y-1">
        {brandCounts.map((item) => {
          const name = item.name;
          const isSelected = selectedMarka === name;
          const logoSlug = slugify(name);

          return (
            <li key={name}>
              <div
                className={`cursor-pointer flex items-center gap-2 ${
                  isSelected ? 'text-red-600 font-bold' : 'text-black hover:text-blue-600'
                }`}
                onClick={() => handleChange('marka', name)}
                title={`${name} (${item.count})`}
              >
                {logoSlug && (
                  <img
                    src={`/logos/${logoSlug}.svg`}
                    alt={name}
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="truncate">{name}</span>
                <span className="text-xs text-gray-500">({item.count})</span>
              </div>

              {isSelected && seriler.length > 0 && (
                <ul className="ml-5 space-y-1">
                  {seriler.map((seri) => {
                    const seriSelected = selectedSeri === seri;
                    return (
                      <li key={seri}>
                        <div
                          className={`cursor-pointer flex items-center ${
                            seriSelected ? 'text-red-600 font-bold' : 'text-black hover:text-blue-600'
                          }`}
                          onClick={() => handleChange('seri', seri)}
                          title={seri}
                        >
                          <FaSquareFull className="text-xs mr-1" />
                          <span className="truncate">{seri}</span>
                        </div>

                        {seriSelected && modeller.length > 0 && (
                          <ul className="ml-4">
                            {modeller.map((model) => {
                              const modelSelected = selectedModel === model; // <-- selectedModel'i kullan
                              return (
                                <li
                                  key={model}
                                  className={`cursor-pointer flex items-center ${
                                    modelSelected
                                      ? 'text-red-600 font-bold'
                                      : 'text-gray-800 hover:text-black'
                                  }`}
                                  onClick={() => handleChange('model', model)}
                                  title={model}
                                >
                                  <FaSquareFull className="text-xs mr-1" />
                                  <span className="truncate">{model}</span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BrandList;
