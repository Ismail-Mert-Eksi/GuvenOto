import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 text-sm mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center flex flex-col items-center gap-5">

        {/* Logo */}
        <Link to="/" className="block">
          <img
            src="/logo.png"
            alt="Güven Oto Logo"
            className="h-25 w-auto object-contain"
          />
        </Link>

        {/* Açıklama metni */}
        <p className="max-w-3xl text-center leading-relaxed">
          <span className="text-yellow-500 font-semibold">Güven Oto</span>’da yer alan mağazaların ve kullanıcıların oluşturduğu tüm içerik, görüş ve bilgilerin doğruluğu, eksiksiz ve değişmez olduğu, yayınlanması ile ilgili yasal yükümlülükler içeriği oluşturan kullanıcıya aittir.
        </p>

        {/* Sosyal medya ikonları */}
        <div className="flex justify-center space-x-4 text-xl text-gray-600">
          <a
            href="https://www.facebook.com/guven.galeri.7"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
            title="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/ocallargroup/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition"
            title="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@ocallargroup"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition"
            title="TikTok"
          >
            <FaTiktok />
          </a>
        </div>

        {/* Telif hakkı satırı */}
        <p className="text-xs text-gray-400 mt-4">
          © {new Date().getFullYear()} Güven Oto. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
