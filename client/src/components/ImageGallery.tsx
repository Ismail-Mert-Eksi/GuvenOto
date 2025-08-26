// src/components/ImageGallery.tsx
import { useEffect, useRef, useState } from "react";
import { BiFullscreen, BiChevronLeft, BiChevronRight } from "react-icons/bi";

type Props = {
  images: string[];
  intervalMs?: number; // default 5000
  className?: string;
};

const ImageGallery = ({ images, intervalMs = 5000, className }: Props) => {
  const safeImages =
    images && images.length > 0
      ? images
      : ["https://via.placeholder.com/1600x900?text=G%C3%B6rsel+Yok"];

  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const goTo = (next: number) =>
    // p kullanılmıyor → parametreyi kaldır
    setIdx(() => (next + safeImages.length) % safeImages.length);

  const next = () => goTo(idx + 1);
  const prev = () => goTo(idx - 1);

  // autoplay
  useEffect(() => {
    if (pausedRef.current || !intervalMs || safeImages.length < 2) return;
    timerRef.current = window.setInterval(() => {
      setIdx((p) => (p + 1) % safeImages.length); // burada p kullanılıyor, sorun yok
    }, intervalMs) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [intervalMs, safeImages.length]);

  // keyboard (modal açıkken)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, idx]);

  return (
    <>
      {/* Ana Galeri */}
      <div className={className}>
        <div
          className="relative w-full aspect-[16/9] overflow-hidden rounded-xl"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          {/* Blur arka plan (overscan) -> kenarlarda beyaz çizgi kalmasın */}
          <div
            className="absolute -inset-[2px] bg-center bg-cover blur-2xl scale-[1.12] will-change-transform"
            style={{ backgroundImage: `url(${safeImages[idx]})` }}
          />

          {/* Ön planda gerçek görüntü (kırpmasız) */}
          <img
            src={safeImages[idx]}
            alt={`foto-${idx + 1}`}
            className="relative z-10 w-full h-full object-contain select-none"
            draggable={false}
          />

          {/* Kontroller */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Önceki"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow z-20"
              >
                <BiChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={next}
                aria-label="Sonraki"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow z-20"
              >
                <BiChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Büyüt */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Büyüt"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow z-20"
          >
            <BiFullscreen className="w-6 h-6" />
          </button>

          {/* Sayaç */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-black/60 text-white px-2 py-1 rounded z-20">
              {idx + 1} / {safeImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail şeridi */}
        {safeImages.length > 1 && (
          <div className="mt-2 px-0.5">
            <div className="flex items-center gap-2 overflow-x-auto">
              {safeImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border transition ${
                    i === idx
                      ? "border-emerald-500 ring-2 ring-emerald-500/40"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  aria-label={`Önizleme ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`thumb-${i + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {i === idx && <span className="absolute inset-0 bg-emerald-500/15" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tam Ekran Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black" onClick={() => setOpen(false)}>
          {/* Blur arka plan */}
          <div
            className="absolute -inset-[2px] bg-center bg-cover blur-2xl scale-[1.12] opacity-40"
            style={{ backgroundImage: `url(${safeImages[idx]})` }}
          />
          {/* Görsel */}
          <img
            src={safeImages[idx]}
            alt={`fullscreen-${idx + 1}`}
            className="relative z-10 w-screen h-screen object-contain select-none"
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          />
          {/* Kontroller */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Önceki"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow z-20"
              >
                <BiChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Sonraki"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow z-20"
              >
                <BiChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <button
            onClick={() => setOpen(false)}
            aria-label="Kapat"
            className="absolute top-3 right-4 text-white text-3xl hover:text-red-400 z-20"
          >
            ✕
          </button>
          {/* Sayaç */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs bg-black/60 text-white px-2 py-1 rounded z-20">
              {idx + 1} / {safeImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
