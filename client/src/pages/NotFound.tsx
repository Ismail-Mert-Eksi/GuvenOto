import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">
      <div className="text-center">
        {/* Büyük 404 rakamı */}
        <h1 className="text-[10rem] md:text-[15rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 animate-pulse">
          404
        </h1>

        {/* Başlık */}
        <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-wide">
          Oops! Sayfa Bulunamadı 🚧
        </h2>

        {/* Açıklama */}
        <p className="mt-3 text-gray-300 text-lg max-w-md mx-auto">
          Aradığınız sayfa taşınmış olabilir, adresi yanlış girmiş olabilirsiniz
          ya da hiç var olmamış olabilir.
        </p>

        {/* Buton */}
        <div className="mt-8">
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-lg text-lg font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition duration-300"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
