// src/components/ContactCard.tsx
import React from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiUser,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

type ContactCardProps = {
  isim: string;
  yetkili?: string;
  telefonlar?: string[];
  adres?: string;
  email?: string;
  whatsappLink?: string; // ör: https://wa.me/905331112233
  className?: string;
};

const ContactCard: React.FC<ContactCardProps> = ({
  isim,
  yetkili,
  telefonlar = [],
  adres,
  email,
  whatsappLink,
  className,
}) => {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const copyToClipboard = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(i);
      setTimeout(() => setCopiedIdx(null), 1200);
    } catch {
      // no-op
    }
  };

  return (
    <div
      className={`rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden ${className ?? ""}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
            <FiMessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight">{isim}</div>
            {yetkili && (
              <div className="text-white/90 text-sm flex items-center gap-1">
                <FiUser className="w-4 h-4" />
                {yetkili}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white p-5 space-y-4">
        {/* Telefonlar */}
        {telefonlar.length > 0 && (
          <div className="space-y-2">
            {telefonlar.map((tel, i) => {
              const telHref = `tel:${tel.replace(/\s+/g, "")}`;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 group"
                >
                  <a
                    href={telHref}
                    className="inline-flex items-center gap-2 text-gray-800 hover:text-blue-700 transition"
                    aria-label={`Ara ${tel}`}
                  >
                    <span className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-blue-50 group-hover:bg-blue-100">
                      <FiPhone className="w-4 h-4" />
                    </span>
                    <span className="font-medium">{tel}</span>
                  </a>

                  <div className="flex items-center gap-2">
                    {/* Kopyala */}
                    <button
                      onClick={() => copyToClipboard(tel, i)}
                      className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
                      aria-label="Numarayı kopyala"
                      title="Kopyala"
                    >
                      {copiedIdx === i ? (
                        <FiCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <FiCopy className="w-4 h-4" />
                      )}
                    </button>

                    {/* WhatsApp tek tık (varsa genel link, yoksa numaradan oluştur) */}
                    <a
                      href={
                        whatsappLink
                          ? whatsappLink
                          : `https://wa.me/${tel.replace(/\D/g, "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                      aria-label="WhatsApp ile mesaj gönder"
                    >
                      <FiMessageCircle className="w-4 h-4" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Email */}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 text-gray-800 hover:text-blue-700 transition"
          >
            <span className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100">
              <FiMail className="w-4 h-4" />
            </span>
            <span className="font-medium">{email}</span>
          </a>
        )}

        {/* Adres */}
        {adres && (
          <div className="flex items-center gap-3 text-gray-700">
            <span className="shrink-0 grid place-items-center w-9 h-9 rounded-lg bg-blue-50">
              <FiMapPin className="w-4 h-4" />
            </span>
            <span>{adres}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
