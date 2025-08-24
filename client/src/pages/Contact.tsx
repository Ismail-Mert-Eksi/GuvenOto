import React from 'react';
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 mb-16 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">İletişim Bilgilerimiz</h1>

      {/* Telefonlar */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Telefon</h2>
        <div className="space-y-2 text-gray-800">
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-gray-500" />
            <span className="select-text cursor-text">0312 309 72 55</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-gray-500" />
            <span className="select-text cursor-text">0312 311 25 52</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-gray-500" />
            <span className="select-text cursor-text">0506 776 80 25</span>
          </div>
        </div>
      </div>

      {/* E-posta */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">E-Posta</h2>
        <div className="flex items-center gap-2 text-gray-800">
          <FaEnvelope className="text-gray-500" />
          <span className="select-text cursor-text">hamza.ocal@hotmail.com</span>
        </div>
      </div>

      {/* Adres */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Adreslerimiz:</h2>
        <div className="flex items-start gap-2 text-gray-800">
          <FaMapMarkerAlt className="text-gray-500 mt-1" />
          <p>
            <strong>MERKEZ:</strong> Kazım Karebekir Caddesi Kazım Karabekir İşHanı 132/34 Dışkapı / ANKARA<br />
            <strong>OTOPARK:</strong> Araçlarımızı Ankara Yenimahalle Yuva Köyü Mermerciler Sitesi Girişi (6) dönümlük galerimizde görebilirsiniz.<br />
            <strong>İKİNCİ EL PARÇA:</strong> Yenimahalle Hurdacılar Sitesi b-8 Blok 3808 Sok. No : 395 Telefon: (312) 396 44 88
          </p>
        </div>
      </div>

      {/* Google Maps */}
    <div className="mb-10 mt-6">
    <iframe
    title="Öcallar Ofis Harita"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.007922430297!2d32.852376476592646!3d39.95112697151943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34e7d74a8e0d7%3A0x8d0c35107c6ae0fb!2zxLBjYWxsYXIgT2Zpcw!5e0!3m2!1str!2str!4v1721905744005!5m2!1str!2str"
    width="100%"
    height="300"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
    </div>


      {/* Sosyal Medya */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Sosyal Medya Hesaplarımızdan Bizi Takip Edebilirsiniz.
        </h2>
        <div className="flex items-center space-x-4 text-2xl">
          <a
            href="https://www.facebook.com/guven.galeri.7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/ocallargroup/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com/@ocallargroup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700"
          >
            <FaTiktok />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
