// src/admin/pages/SparePartAddPage.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import RichTextEditor from '../components/RichTextEditor';
import { api } from '../../lib/axios';

const isHtmlEmpty = (html: string) => {
  // <p><br></p>, &nbsp; ve boşlukları da boş kabul et
  const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
  return text.length === 0;
};

const SparePartAddPage: React.FC = () => {
  const [ilanBasligi, setIlanBasligi] = useState('');
  const [fiyat, setFiyat] = useState<string>(''); // "12500" gibi string; backend sayıya çeviriyor
  const [marka, setMarka] = useState<string>(''); // opsiyonel
  const [ilanDetay, setIlanDetay] = useState('');
  const [resimler, setResimler] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // ObjectURL temizlik
  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  const handleDropImages = (newFiles: File[]) => {
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setResimler((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    // ObjectURL temizle
    const url = previewUrls[index];
    if (url) URL.revokeObjectURL(url);

    setResimler((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!ilanBasligi.trim()) {
      toast.error('İlan başlığı boş olamaz.');
      return;
    }
    if (isHtmlEmpty(ilanDetay)) {
      toast.error('İlan detayı boş olamaz.');
      return;
    }
    if (resimler.length === 0) {
      toast.error('En az 1 görsel yüklemelisiniz.');
      return;
    }

    const formData = new FormData();
    formData.append('ilanBasligi', ilanBasligi.trim());
    formData.append('ilanDetay', ilanDetay); // HTML (backend sanitize ediyor)
    if (fiyat.trim() !== '') formData.append('fiyat', fiyat.replace(/\./g, '').trim());
    if (marka.trim() !== '') formData.append('marka', marka.trim());
    resimler.forEach((file) => formData.append('resimler', file)); // <-- backend: upload.array('resimler', 5)

    try {
      setSubmitting(true);
      await api.post('/spareparts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Yedek parça başarıyla eklendi');
      navigate('/admin/spare-parts');
    } catch (err) {
      console.error(err);
      toast.error('Ekleme işlemi başarısız');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🔧 Yedek Parça Ekle</h2>

      <form onSubmit={handleSubmit} autoComplete="off" className="grid md:grid-cols-3 gap-6">
        {/* Sol: Bilgi Girişi */}
        <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-blue-700">Parça Bilgileri</h3>

          <input
            type="text"
            placeholder="İlan Başlığı *"
            value={ilanBasligi}
            onChange={(e) => setIlanBasligi(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
          type="text"
          placeholder="Fiyat"
          value={fiyat}
          onChange={(e) => {
          const raw = e.target.value; // kullanıcının yazdığı
          const digits = raw.replace(/\D/g, ''); // sadece rakamlar
          const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // binlik ayırma
        setFiyat(formatted);
        }}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

          <input
            type="text"
            placeholder="Marka"
            value={marka}
            onChange={(e) => setMarka(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Orta: Görsel Yükleme */}
        <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
          <label className="block text-lg font-semibold text-indigo-600">Görseller *</label>
          <ImageUploader
            files={resimler}
            previewUrls={previewUrls}
            onDrop={handleDropImages}
            onRemove={handleRemoveImage}
            // istersen max 5 görsel kısıtını burada da gösterebilirsin
          />
        </div>

        {/* Sağ: Açıklama ve Gönder */}
        <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-indigo-600">Parça Açıklaması *</label>
            <RichTextEditor
              value={ilanDetay}
              onChange={setIlanDetay}
              placeholder="Parça açıklamasını yazın..."
              height={320}
              toolbar="basic" // istersen "full"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2 rounded self-end"
          >
            {submitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SparePartAddPage;
