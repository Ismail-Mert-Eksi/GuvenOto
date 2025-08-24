// src/components/ImageUploader.tsx
import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface Props {
  files: File[];
  previewUrls: string[];
  onDrop: (files: File[]) => void;
  onRemove: (index: number) => void;

  initialImages?: { url: string; public_id: string }[];
  onRemoveExisting?: (public_id: string) => void;
}

const ImageUploader: React.FC<Props> = ({
  files,
  previewUrls,
  onDrop,
  onRemove,
  initialImages = [],
  onRemoveExisting,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [existingImages, setExistingImages] = useState(initialImages);
  const [isCompressing, setIsCompressing] = useState(false);

  // Mevcut (serverdaki) görselleri prop değişince senkronla
  useEffect(() => {
    const isSame =
      existingImages.length === initialImages.length &&
      existingImages.every((img, i) =>
        img.url === initialImages[i]?.url && img.public_id === initialImages[i]?.public_id
      );
    if (!isSame) setExistingImages(initialImages);
  }, [initialImages, existingImages]);

  // Ortak: gelen dosyaları sıkıştırıp parent'a ver
  const compressAndEmit = async (incoming: File[]) => {
    const imagesOnly = incoming.filter(f => f.type.startsWith('image/'));
    if (imagesOnly.length === 0) return;

    setIsCompressing(true);
    const options = {
      maxSizeMB: 0.5,            // ~500KB hedef
      maxWidthOrHeight: 1920,    // uzun kenar sınırı
      useWebWorker: true,
      fileType: 'image/webp',    // WebP'e çevir
      initialQuality: 0.8,       // %80 kalite
    } as const;

    const compressed: File[] = [];
    for (const file of imagesOnly) {
      try {
        const out = await imageCompression(file, options);
        // İsim uzantısını .webp yap (opsiyonel ama düzenli olur)
        const named = new File([out], file.name.replace(/\.\w+$/, '.webp'), {
          type: 'image/webp',
          lastModified: Date.now(),
        });
        compressed.push(named);
      } catch (e) {
        console.error('Compress hatası:', e);
        // Hata olursa orijinali kullan
        compressed.push(file);
      }
    }
    setIsCompressing(false);
    onDrop(compressed);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    await compressAndEmit(Array.from(e.dataTransfer.files));
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    await compressAndEmit(selected);
    // Aynı dosyayı tekrar seçebilmek için input'u sıfırla
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemoveExisting = (public_id: string) => {
    setExistingImages(prev => prev.filter(img => img.public_id !== public_id));
    onRemoveExisting?.(public_id);
  };

  return (
    <div>
      <div
        className="w-full border-2 border-dashed border-gray-400 rounded-md p-6 text-center cursor-pointer hover:bg-gray-100 transition"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
          <UploadCloud size={32} />
          <p>Görselleri buraya sürükleyin veya tıklayarak seçin</p>
          <p className="text-sm text-gray-500">
            Yeni seçilen dosya sayısı: {files.length}{' '}
            {isCompressing && '• sıkıştırılıyor…'}
          </p>
        </div>
        <input
          type="file"
          ref={inputRef}
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {(previewUrls.length > 0 || existingImages.length > 0) && (
        <div className="flex flex-wrap gap-3 mt-4">
          {/* Yeni yüklenenler */}
          {previewUrls.map((url, index) => (
            <div key={`new-${index}`} className="relative w-24 h-24 rounded border overflow-hidden">
              <img src={url} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-bl text-xs"
              >
                ×
              </button>
            </div>
          ))}

          {/* Mevcut sunucu görselleri */}
          {existingImages.map((img) => (
            <div key={img.public_id} className="relative w-24 h-24 rounded border overflow-hidden">
              <img src={img.url} alt="existing" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveExisting(img.public_id)}
                className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-bl text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
