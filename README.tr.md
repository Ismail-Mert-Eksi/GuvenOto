# 🚗 GüvenOto – Araç & Yedek Parça İlan Platformu

GüvenOto, araç ve yedek parça ilanlarını listelemek, filtrelemek ve yönetmek için
geliştirilmiş modern bir **full-stack** uygulamadır.  
**Backend:** Node.js + Express • **Frontend:** React + Vite + TypeScript • **Database:** MongoDB Atlas

---

## ✨ Özellikler

- 🔑 **Admin Paneli**
  - JWT + HTTP-Only cookie ile güvenli oturum
  - Admin şifresi **bcrypt hash** ile doğrulanır (`ADMIN_PASSWORD_HASH`)
  - Giriş denemelerinde **rate limit**
  - Araç & yedek parça CRUD (ekleme/düzenleme/silme)
  - Çoklu Fotoğraf ekleme(ImageKit.io/CDN)
  - Zengin metin editörü (jodit)

- 👥 **Kullanıcı Arayüzü**
  - Zengin **filtreleme** (marka/seri/model, yıl, km, fiyat, yakıt, vites, kasa tipi, renk, acil/modifiye/klasik)
  - **Çoklu checkbox** filtre desteği (Axios `paramsSerializer` ile düzgün URL)
  - **Sıralama** (fiyat, yıl, km, ilan tarihi)
  - **Sayfalama (pagination)**: liste ve arama sonuçları
  - Arama sayfası: araçlar + yedek parçalar ayrı sayfalanır

- 🛡 **Güvenlik**
  - Admin parolası **hash**’li saklanır (bcrypt)
  - **JWT_SECRET** ile imzalanmış JWT, httpOnly cookie’de tutulur
  - **Rate limiting** (login ve genel istekler)
  - CORS whitelist, Helmet, güvenli cookie ayarları

---

## 🗂 Proje Yapısı

GüvenOto/
│── client/ # Frontend (React + Vite + TS)
│ ├── src/
│ ├── public/
│ └── .env.development
│
│── server/ # Backend (Node.js + Express)
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── middleware/
│ └── .env
│
└── README.md


---

## 🧰 Gereksinimler

- Node.js **18+**
- npm / yarn / pnpm (tercihen npm 9+)

---

## ⚙️ Kurulum (Geliştirme)

# Repoyu klonla
git clone https://github.com/<kullanici-adin>/<repo-adi>.git

# Proje klasörüne gir
cd <repo-adi>

**Bağımlılıkları kur**
```bash
# client
cd client && npm install

# server
cd ../server && npm install


# Backend
cd server
npm run dev   # yoksa: node server.js

# Frontend
cd ../client
npm run dev   # Vite varsayılan: http://localhost:5173







