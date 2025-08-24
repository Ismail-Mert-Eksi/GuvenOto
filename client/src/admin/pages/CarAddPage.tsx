// src/pages/CarAddPage.tsx
import React, { useState } from 'react';
import { api } from '../../lib/axios';
import toast from 'react-hot-toast';
// ⬇️ Tiptap yerine Jodit tabanlı editor
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';

const formatNumber = (value: string) =>
  value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const CarAddPage = () => {
  const [form, setForm] = useState({
    marka: '', model: '', seri: '', yil: '', kilometre: '', renk: '', tipi: '',
    yakitTipi: '', motorHacmi: '', motorGucu: '', vitesTipi: '', kasaTipi: '',
    modifiye: false, klasik: false, acil: false, ilanBasligi: '', fiyat: ''
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [ilanDetay, setIlanDetay] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormattedNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: 'fiyat' | 'kilometre'
  ) => {
    const raw = e.target.value.replace(/\./g, '');
    if (!/^\d*$/.test(raw)) return;
    setForm(prev => ({ ...prev, [key]: formatNumber(raw) }));
  };

  const handleDropImages = (newFiles: File[]) => {
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setFiles(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      const val =
        key === 'fiyat' || key === 'kilometre'
          ? value.toString().replace(/\./g, '')
          : value.toString();
      formData.append(key, val);
    });

    // ⬇️ Jodit'ten gelen HTML içeriği
    formData.append('ilanDetay', ilanDetay);

    files.forEach(file => formData.append('resimler', file));

    try {
      await api.post('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Araç başarıyla eklendi!');
      setForm({
        marka: '', model: '', seri: '', yil: '', kilometre: '', renk: '', tipi: '',
        yakitTipi: '', motorHacmi: '', motorGucu: '', vitesTipi: '', kasaTipi: '',
        modifiye: false, klasik: false, acil: false, ilanBasligi: '', fiyat: ''
      });
      setFiles([]);
      setPreviewUrls([]);
      setIlanDetay('');
    } catch {
      toast.error('Araç eklenemedi!');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🚗 Araç Ekle</h1>
      <form onSubmit={handleSubmit} autoComplete="off" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bilgi Giriş Alanı */}
        <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Araç Bilgileri</h2>
          {[
            "ilanBasligi","marka","model","seri","yil","fiyat","kilometre",
            "renk","vitesTipi","yakitTipi","motorHacmi","motorGucu","tipi","kasaTipi"
          ].map(name => (
            <input
              key={name}
              type={name === 'yil' ? 'number' : 'text'}
              name={name}
              placeholder={name}
              autoComplete="off"
              value={(form as any)[name]}
              onChange={
                name === 'fiyat' || name === 'kilometre'
                  ? (e) => handleFormattedNumberChange(e, name as 'fiyat' | 'kilometre')
                  : handleChange
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Görsel ve Checkboxlar */}
        <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
          <div>
            <label className="block text-lg font-semibold text-indigo-600 mb-2">Görseller</label>
            <ImageUploader
              files={files}
              previewUrls={previewUrls}
              onDrop={handleDropImages}
              onRemove={removeImage}
            />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-indigo-600">Etiketler</p>
            {["acil", "klasik", "modifiye"].map(field => (
              <label key={field} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={field}
                  checked={(form as any)[field]}
                  onChange={handleChange}
                />
                <span className="capitalize text-gray-700">{field}</span>
              </label>
            ))}
          </div>
        </div>

        {/* İlan Detayı ve Kaydet Butonu */}
        <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-indigo-600">İlan Detayı</label>
            {/* ⬇️ Jodit tabanlı editor */}
            <RichTextEditor
              value={ilanDetay}
              onChange={setIlanDetay}
              placeholder="İlan detayını yazın..."
              height={360}
              toolbar="basic" // istersen "full"
            />
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition w-fit self-end"
          >
            Aracı Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarAddPage;
