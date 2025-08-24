// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const verifyToken = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter'); // ✅ rate limiter

const router = express.Router();

const isProd = process.env.NODE_ENV === 'production';

// Env’den ayarlar
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || '').toLowerCase();
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
// Rollout/fallback için (geçici): hash’e geçiş sürecinde kullanılabilir
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD || '';

// 🟦 LOGIN (rate limit ile)
router.post('/login', loginLimiter, async (req, res) => {
  try {
    let { username, password } = req.body || {};
    username = (username || '').toLowerCase().trim();
    password = (password || '').trim();

    if (!username || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı ve şifre gerekli.' });
    }

    // Kullanıcı adı kontrolü (case-insensitive)
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // 1) Tercihen HASH ile doğrula
    let ok = false;
    if (ADMIN_PASSWORD_HASH) {
      ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    }
    // 2) Geçiş dönemi: hash henüz yoksa düz metinle (GEÇİCİ) doğrula
    else if (ADMIN_PASSWORD_PLAIN) {
      ok = password === ADMIN_PASSWORD_PLAIN;
    }
    // 3) Hiçbiri yoksa yanlış yapılandırma
    else {
      return res.status(500).json({ message: 'Sunucu yapılandırması eksik: ADMIN_PASSWORD_HASH' });
    }

    if (!ok) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // JWT üret
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // HTTP-only cookie olarak ayarla
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,     // prod'da HTTPS şart
      sameSite: 'lax',
      maxAge: 1 * 60 * 60 * 1000, // 1 saat
      path: '/',          // açıkça belirtmek iyi olur
    });

    return res.status(200).json({ message: 'Giriş başarılı' });
  } catch (err) {
    console.error('Login hata:', err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// 🟩 Oturum kontrolü
router.get('/check', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Giriş başarılı', user: req.user });
});

// 🟥 LOGOUT (cookie’yi doğru şekilde temizle)
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/', // set ederken ne verdiysen temizlerken de aynı olmalı
  });
  res.status(200).json({ message: 'Çıkış yapıldı' });
});

module.exports = router;
