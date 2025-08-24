// ✅ CarEditPage.tsx (Jodit / RichTextEditor entegre)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import type { Car } from '../../types/car';
import { toast } from 'react-hot-toast';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';

const formatNumber = (value: string) =>
  value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const CarEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Car>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [silinecekResimler, setSilinecekResimler] = useState<string[]>([]);
  const [mevcutResimler, setMevcutResimler] = useState<{ url: string; public_id: string }[]>([]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        const data = res.data as Car;

        // Noktalı format
        const fiyatFmt = data.fiyat?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const kmFmt = data.kilometre?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        setForm({ ...data, fiyat: fiyatFmt as any, kilometre: kmFmt as any });
        setMevcutResimler(data.resimler || []);
      } catch {
        toast.error('Araç bilgisi alınamadı');
      }
    };
    if (id) fetchCar();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'fiyat' || name === 'kilometre') {
      const raw = value.replace(/\./g, '');
      if (!/^\d*$/.test(raw)) return;
      setForm(prev => ({ ...prev, [name]: formatNumber(raw) }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleDropImages = (newFiles: File[]) => {
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setFiles(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const handleRemovePreviewImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (public_id: string) => {
    setSilinecekResimler(prev => [...prev, public_id]);
    setMevcutResimler(prev => prev.filter(img => img.public_id !== public_id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        const rawValue =
          (key === 'fiyat' || key === 'kilometre') && typeof value === 'string'
            ? value.replace(/\./g, '')
            : value;
        fd.append(key, rawValue.toString());
      }
    });

    files.forEach(file => fd.append('resimler', file));
    silinecekResimler.forEach(id => fd.append('silinecekResimler', id));

    try {
      await api.put(`/cars/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Araç güncellendi');
      navigate(`/${import.meta.env.VITE_ADMIN_SLUG}/cars`); // ✅ env slug eklendi
    } catch {
      toast.error('Araç güncellenemedi');
    }
  };

  const textFields: (keyof Car)[] = [
    'ilanBasligi','marka','model','seri','yil','fiyat','kilometre','renk','vitesTipi','yakitTipi','motorHacmi','motorGucu','tipi','kasaTipi',
  ];
  const checkboxFields: (keyof Car)[] = ['acil', 'klasik', 'modifiye'];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🚗 Araç Düzenle</h2>
      <form onSubmit={handleSubmit} autoComplete="off" className="grid md:grid-cols-3 gap-6">
        {/* Bilgi Alanı */}
        <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-blue-700">Araç Bilgileri</h3>
          {textFields.map((key) => (
            <input
              key={key}
              type={key === 'yil' ? 'number' : 'text'}
              name={key}
              placeholder={key}
              value={
                typeof form[key] === 'boolean'
                  ? String(form[key])
                  : (form[key] as string | number | undefined) ?? ''
              }
              onChange={handleChange}
              autoComplete="off"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          {checkboxFields.map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={key}
                checked={Boolean(form[key])}
                onChange={handleChange}
              />
              <span className="capitalize text-gray-700">{key}</span>
            </label>
          ))}
        </div>

        {/* Görseller */}
        <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
          <label className="block text-lg font-semibold text-indigo-600">Görseller</label>
          <ImageUploader
            files={files}
            previewUrls={previewUrls}
            onDrop={handleDropImages}
            onRemove={handleRemovePreviewImage}
            initialImages={mevcutResimler}
            onRemoveExisting={handleRemoveExistingImage}
          />
        </div>

        {/* İlan Detay ve Gönder */}
        <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-indigo-600">İlan Detayı</label>
            <RichTextEditor
              value={(form.ilanDetay as string) ?? ''}
              onChange={(html) => setForm(prev => ({ ...prev, ilanDetay: html }))}
              placeholder="İlan detayını yazın..."
              height={360}
              toolbar="basic"
            />
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded self-end"
          >
            Güncelle
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarEditPage;
