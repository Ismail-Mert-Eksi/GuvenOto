// src/admin/pages/AdminLoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/axios';

// ✅ Admin slug'ı env'den al
const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || 'admin';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/login', { username, password });
      // ✅ slug'ı kullanarak yönlendirme
      navigate(`/${ADMIN_SLUG}/dashboard`);
    } catch (err) {
      setError('Giriş başarısız. Kullanıcı adı veya şifre yanlış.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo + ana sayfaya link */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="group inline-flex items-center gap-3">
            <img
              src="/logo.png"
              alt="GüvenOto"
              className="h-16 w-auto rounded-lg shadow-sm group-hover:scale-105 transition-transform"
              draggable={false}
            />
            <span className="text-xl font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
              GüvenOto • Admin
            </span>
          </Link>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/90 backdrop-blur p-6 md:p-7 rounded-2xl shadow-xl border border-slate-200"
          autoComplete="off"
        >
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Admin Girişi</h2>
          <p className="text-center text-sm text-slate-500 mb-6">Lütfen bilgilerinizi giriniz.</p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              name="no-autofill-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="text"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Şifre
            </label>

            {/* Şifre inputu + toggle */}
            <div className="relative">
              <input
                id="password"
                name="current-password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white pr-11 px-3 py-2.5 text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
                autoComplete="current-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
              />

              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                onMouseDown={(e) => e.preventDefault()}
                aria-label={showPw ? 'Şifreyi gizle' : 'Şifreyi göster'}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
                title={showPw ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {showPw ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" d="M3 3l18 18M9.88 5.38A10.5 10.5 0 0 1 12 5c7 0 10 7 10 7a10.9 10.9 0 0 1-3.76 4.58M6.1 8.33A10.7 10.7 0 0 0 2 12s3 7 10 7c1.7 0 3.23-.36 4.57-1.01" />
                  <path strokeWidth="2" d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 text-white font-semibold py-2.5 shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:bg-blue-800 transition-colors"
          >
            Giriş Yap
          </button>

          <div className="mt-4 text-center text-xs text-slate-500">
            <span className="opacity-80">Ana sayfaya dönmek için </span>
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              tıklayın
            </Link>
            .
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
