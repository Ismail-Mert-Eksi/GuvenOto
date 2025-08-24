// routes/spareRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllSpareParts,
  addSparePart,
  getSparePartById,
  getSparePartByIlanNo,
  deleteSparePart,
  updateSparePartById,
} = require('../controllers/sparePartController');

const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// --- Basit query validation middleware ---
function validateListQuery(req, res, next) {
  const { page, limit, sort } = req.query;

  if (page && (!/^\d+$/.test(page) || Number(page) < 1)) {
    return res.status(400).json({ message: 'page değeri pozitif tam sayı olmalı' });
  }
  if (limit && (!/^\d+$/.test(limit) || Number(limit) < 1 || Number(limit) > 100)) {
    return res.status(400).json({ message: 'limit 1-100 arası olmalı' });
  }
  if (sort && !/^(ilanTarihi|fiyat|ilanNo):(asc|desc)$/.test(sort)) {
    return res.status(400).json({ message: 'sort formatı: alan:asc|desc (alan=ilanTarihi|fiyat|ilanNo)' });
  }
  next();
}

// ✅ Listeleme (search+sort+pagination destekli)
router.get('/', validateListQuery, getAllSpareParts);

// ✅ Tek parça getir - ilanNo ile
router.get('/ilan/:ilanNo', getSparePartByIlanNo);

// ✅ Tek parça getir - ID ile
router.get('/by-id/:id', getSparePartById);

// ✅ Yeni yedek parça ekle (auth → upload)
router.post(
  '/',
  verifyToken,
  upload.array('resimler', 5), // 5 görsel limiti
  addSparePart
);

// ✅ Yedek parça güncelle (ID ile)
router.put(
  '/by-id/:id',
  verifyToken,
  upload.array('resimler', 5),
  updateSparePartById
);

// ✅ Yedek parça sil (ID ile) — isimlendirmeyi tutarlı yaptık
router.delete('/by-id/:id', verifyToken, deleteSparePart);

module.exports = router;
