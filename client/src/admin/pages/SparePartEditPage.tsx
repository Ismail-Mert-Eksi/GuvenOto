// src/admin/pages/SparePartEditPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImageUploader from '../components/ImageUploader';
import RichTextEditor from '../components/RichTextEditor';
import { api } from '../../lib/axios';

interface SparePart {
  _id: string;
  ilanNo: string;
  ilanBasligi?: string;
  fiyat?: number;
  ilanDetay?: string;
  resimler: { url: string; public_id: string }[];
}

const isHtmlEmpty = (html: string) => {
  const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
  return text.length === 0;
};

const SparePartEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sparePart, setSparePart] = useState<SparePart | null>(null);
  const [ilanBasligi, setIlanBasligi] = useState('');
  const [fiyat, setFiyat] = useState<string>(''); // string; backend sayıya çeviriyor
  const [ilanDetay, setIlanDetay] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [initialImages, setInitialImages] = useState<{ url: string; public_id: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSparePart = async () => {
      try {
        const { data } = await api.get(`/spareparts/by-id/${id}`);
        setSparePart(data);
        setIlanBasligi(data.ilanBasligi || '');
        setFiyat(
          data.fiyat != null
            ? String(data.fiyat).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            : ''
        );
        setIlanDetay(data.ilanDetay || '');
        setInitialImages(data.resimler || []);
      } catch (err) {
        console.error(err);
        toast.error('Parça bilgileri alınamadı.');
      }
    };

    if (id) fetchSparePart();

    // ObjectURL temizlik
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDropImages = (files: File[]) => {
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index: number) => {
    const url = previewUrls[index];
    if (url) URL.revokeObjectURL(url);

    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExisting = (public_id: string) => {
    setDeletedImageIds((prev) => [...prev, public_id]);
    setInitialImages((prev) => prev.filter((img) => img.public_id !== public_id));
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

    const formData = new FormData();
    formData.append('ilanBasligi', ilanBasligi.trim());
    formData.append('ilanDetay', ilanDetay); // backend sanitize ediyor
    if (fiyat.trim() !== '') formData.append('fiyat', fiyat.replace(/\./g, '').trim());

    // Silinecek görseller
    deletedImageIds.forEach((pid) => formData.append('silinecekResimler', pid));

    // Yeni eklenecek görseller
    newImages.forEach((file) => formData.append('resimler', file));

    try {
      setSubmitting(true);
      await api.put(`/spareparts/by-id/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Parça başarıyla güncellendi.');
      navigate('/admin/spare-parts');
    } catch (err) {
      console.error(err);
      toast.error('Güncelleme başarısız.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!sparePart) return <p className="p-4">Yükleniyor...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🛠️ Yedek Parça Güncelle</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6" autoComplete="off">
        {/* Bilgi Formu */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
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
            placeholder="Fiyat (TL) — örn: 12.500"
            value={fiyat}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ''); // Rakam olmayanları sil
              const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Nokta ekle
              setFiyat(formattedValue);
            }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Görsel Yükleme */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-indigo-700">Görseller</h3>
          <ImageUploader
            files={newImages}
            previewUrls={previewUrls}
            onDrop={handleDropImages}
            onRemove={handleRemoveImage}
            initialImages={initialImages}
            onRemoveExisting={handleRemoveExisting}
          />
        </div>

        {/* Açıklama Alanı */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-indigo-700">Parça Açıklaması *</label>
            <RichTextEditor
              value={ilanDetay}
              onChange={setIlanDetay}
              placeholder="Parça açıklamasını yazın..."
              height={320}
              toolbar="basic"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2 rounded self-end"
          >
            {submitting ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SparePartEditPage;
