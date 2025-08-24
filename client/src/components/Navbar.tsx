// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (term) {
      navigate(`/search?anahtarKelime=${encodeURIComponent(term)}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-300 shadow-sm  top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3 gap-6">


        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center">
  <img
    src="/logo.png"
    alt="Güvenoto Logo"
    className="h-20 w-auto max-h-20 object-contain"
  />
</Link>



        {/* Arama kutusu */}
        <div className="flex flex-1 max-w-2xl mx-2 items-center">
          <input
            type="text"
            placeholder="Kelime, İlan No, Marka, Seri, Model ile Arama"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-full border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800"
          >
            🔍
          </button>
        </div>

        {/* Desktop Menü */}
        <div className="font-semibold hidden md:flex space-x-3 text-sm text-gray-700 mr-5">
         <Link to="/" className="hover:text-blue-500">Anasayfa</Link>
        <Link to="/contact" className="hover:text-blue-500">İletişim</Link>
        </div>


        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="text-gray-700 text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu İçeriği */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-2 space-y-2 text-gray-700 text-sm">
          <Link to="/" className="block hover:text-blue-500" onClick={() => setMenuOpen(false)}>Anasayfa</Link>
          <Link to="/contact" className="block hover:text-blue-500" onClick={() => setMenuOpen(false)}>İletişim</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
