# 🚗 GüvenOto – Vehicle & Spare Parts Listing Platform
🇹🇷 [Türkçe dokümantasyon için buraya tıklayın](README.tr.md)
GüvenOto is a modern **full-stack** application developed to list, filter, and manage vehicles and spare parts.  
**Backend:** Node.js + Express • **Frontend:** React + Vite + TypeScript • **Database:** MongoDB Atlas

---

## ✨ Features

- 🔑 **Admin Panel**
  - Secure login with JWT + HTTP-Only cookie
  - Admin password validated with **bcrypt hash** (`ADMIN_PASSWORD_HASH`)
  - Login attempts are **rate-limited**
  - Vehicle & spare part CRUD (create / update / delete)
  - Multiple photo upload (ImageKit.io / with CDN)
  - Rich text editor (Jodit)

- 👥 **User Interface**
  - Advanced **filtering** (brand/series/model, year, km, price, fuel, transmission, body type, color, urgent/modified/classic)
  - **Multi-checkbox** filtering (with Axios `paramsSerializer` for clean URLs)
  - **Sorting** (price, year, km, listing date)
  - **Pagination** for listings and search results
  - Search page: vehicles & spare parts are paginated separately

- 🛡 **Security**
  - Admin password stored **hashed** (bcrypt)
  - JWT signed with **JWT_SECRET**, stored in httpOnly cookie
  - **Rate limiting** (login and general requests)
  - CORS whitelist, Helmet, secure cookie settings

---

## 🗂 Project Structure

GüvenOto/
│── client/   # Frontend (React + Vite + TS)
│   ├── src/
│   ├── public/
│   └── .env.development
│
│── server/   # Backend (Node.js + Express)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── .env
│
└── README.md

---

## 🧰 Requirements

- Node.js **18+**
- npm / yarn / pnpm (npm 9+ recommended)

---

## ⚙️ Setup (Development)

Clone the repo:
```bash
git clone https://github.com/<your-username>/<repo-name>.git
```

Navigate into the project:
```bash
cd <repo-name>
```

Install dependencies:
```bash
# client
cd client && npm install

# server
cd ../server && npm install
```

Run backend:
```bash
cd server
npm run dev   # or: node server.js
```

Run frontend:
```bash
cd ../client
npm run dev   # Vite default: http://localhost:5173
```
