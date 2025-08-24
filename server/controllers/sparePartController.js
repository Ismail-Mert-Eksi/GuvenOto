// controllers/sparePartController.js
const SparePart = require('../models/SparePart');
const imagekit = require('../utils/imagekit');
const getNextIlanNo = require('../utils/getNextIlanNo');
const { cleanHtml } = require('../utils/cleanHtml');


// küçük yardımcı: regex kaçış
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// yardımcı: "12.500" -> 12500
function toNumberSafe(v) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') return undefined;
  const s = v.replace(/\./g, '').replace(/,/g, '.'); // TR formatting toleransı
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

// Yedek parça ekle (ImageKit ile)
// ... dosyanın üst kısmı aynı
// Yedek parça ekle (ImageKit ile)
const addSparePart = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'En az bir resim gerekli.' });
    }

    const { ilanBasligi, ilanDetay } = req.body;
    if (!ilanBasligi || !ilanDetay) {
      return res.status(400).json({ message: 'ilanBasligi ve ilanDetay zorunludur.' });
    }

    const ilanDetayClean = cleanHtml(String(ilanDetay));
    if (ilanDetayClean.length > 100000) {
      return res.status(413).json({ message: 'İlan detayı çok büyük.' });
    }

    const fiyatNum = toNumberSafe(req.body.fiyat);
    if (req.body.fiyat !== undefined && fiyatNum === undefined) {
      return res.status(400).json({ message: 'Geçersiz fiyat formatı.' });
    }

    const imageInfos = [];
    for (const file of files) {
      const result = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: 'guvenoto_yedekparca',
      });
      imageInfos.push({ url: result.url, public_id: result.fileId });
    }

    // ⬇️ Koleksiyon bazlı ilan no (opsiyonel pad/prefix)
const nextIlanNo = await getNextIlanNo('sparepart', { pad: 6, prefix: 'YDK-' });

const newPart = new SparePart({
  ilanNo: nextIlanNo,
  ilanBasligi: String(ilanBasligi).trim(),
  ilanDetay: ilanDetayClean,
  fiyat: fiyatNum,
  marka: req.body.marka?.toString().trim(),
  resimler: imageInfos,
});


    const savedPart = await newPart.save();
    res.status(201).json(savedPart);
  } catch (err) {
    console.error('Parça eklenemedi:', err);
    res.status(400).json({ message: 'Parça eklenemedi', error: String(err?.message || err) });
  }
};


// ID ile getir + görüntülenme sayacı artır
const getSparePartById = async (req, res) => {
  try {
    const part = await SparePart.findByIdAndUpdate(
      req.params.id,
      { $inc: { ilanGoruntulenme: 1 } },
      { new: true }
    );
    if (!part) return res.status(404).json({ message: 'Parça bulunamadı' });
    res.status(200).json(part);
  } catch (err) {
    res.status(500).json({ message: 'Parça getirilemedi', error: String(err?.message || err) });
  }
};

// ilanNo ile getir + görüntülenme sayacı artır
const getSparePartByIlanNo = async (req, res) => {
  try {
    const part = await SparePart.findOneAndUpdate(
      { ilanNo: req.params.ilanNo },
      { $inc: { ilanGoruntulenme: 1 } },
      { new: true }
    );
    if (!part) return res.status(404).json({ message: 'Parça bulunamadı' });
    res.status(200).json(part);
  } catch (err) {
    res.status(500).json({ message: 'Parça getirilemedi', error: String(err?.message || err) });
  }
};

// Listele (search + sort + pagination)
const getAllSpareParts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const search = (req.query.search || '').toString().trim();
    const sortQ = (req.query.sort || 'ilanTarihi:desc').toString();

    // Arama: ilanNo prefix + başlık/marka kısmi
    const filter = {};
    if (search) {
      const esc = escapeRegex(search);
      filter.$or = [
        // YDK, YDK-000123 gibi ilanNumaralarını yakalar (prefix eşleşme)
        { ilanNo: { $regex: `^${esc}`, $options: 'i' } },
        { ilanBasligi: { $regex: esc, $options: 'i' } },
        { marka: { $regex: esc, $options: 'i' } },
      ];
    }

    // Sıralama
    const [sf, so] = sortQ.split(':');
    const allowedSort = new Set(['ilanTarihi', 'fiyat', 'ilanNo']);
    const sortField = allowedSort.has(sf) ? sf : 'ilanTarihi';
    const sortOrder = so === 'asc' ? 1 : -1;

    const total = await SparePart.countDocuments(filter);
    const parts = await SparePart.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: parts,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Veriler getirilemedi', error: String(err?.message || err) });
  }
};

// Güncelle (ID ile - resim ekleme/silme dahil)
const updateSparePartById = async (req, res) => {
  try {
    const { id } = req.params;

    // ilanNo değiştirilemez
    if ('ilanNo' in req.body) delete req.body.ilanNo;

    const sparePart = await SparePart.findById(id);
    if (!sparePart) return res.status(404).json({ message: 'Parça bulunamadı' });

    // Silinecek resimler (tek string veya array olabilir)
    const silinecekResimlerRaw = req.body.silinecekResimler;
    const silinecekResimler = Array.isArray(silinecekResimlerRaw)
      ? silinecekResimlerRaw
      : silinecekResimlerRaw
      ? [silinecekResimlerRaw]
      : [];

    if (silinecekResimler.length > 0) {
      for (const publicId of silinecekResimler) {
        try {
          await imagekit.deleteFile(publicId);
        } catch (e) {
          // var olmayan public_id silinmeye çalışılırsa akış bozulmasın
          console.warn('Image delete skipped:', publicId, e?.message || e);
        }
        sparePart.resimler = sparePart.resimler.filter((img) => img.public_id !== publicId);
      }
    }

    // Yeni resimler
    const files = req.files;
    if (files && files.length > 0) {
      for (const file of files) {
        const result = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: 'guvenoto_yedekparca',
        });
        // aynı public_id iki kez eklenmesin
        if (!sparePart.resimler.some((x) => x.public_id === result.fileId)) {
          sparePart.resimler.push({ url: result.url, public_id: result.fileId });
        }
      }
    }

    // Diğer alanlar (falsy değerleri de doğru işleyelim)
    if ('ilanBasligi' in req.body) {
      sparePart.ilanBasligi = String(req.body.ilanBasligi).trim();
    }
    if ('fiyat' in req.body) {
      const fiyatNum = toNumberSafe(req.body.fiyat);
      if (req.body.fiyat !== '' && req.body.fiyat !== undefined && fiyatNum === undefined) {
        return res.status(400).json({ message: 'Geçersiz fiyat formatı.' });
      }
      sparePart.fiyat = fiyatNum; // undefined ise alanı boşaltır (opsiyonel alan)
    }
    if ('marka' in req.body) {
      sparePart.marka = req.body.marka?.toString().trim() || undefined;
    }
    if ('ilanDetay' in req.body && typeof req.body.ilanDetay === 'string') {
      const ilanDetayClean = cleanHtml(req.body.ilanDetay);
      if (ilanDetayClean.length > 100000) {
        return res.status(413).json({ message: 'İlan detayı çok büyük.' });
      }
      sparePart.ilanDetay = ilanDetayClean;
    }

    const updatedPart = await sparePart.save();
    res.status(200).json(updatedPart);
  } catch (err) {
    console.error('Parça güncellenemedi:', err);
    res.status(500).json({ message: 'Parça güncellenemedi', error: String(err?.message || err) });
  }
};

// Silme (ImageKit’ten görselleri de sil)
const deleteSparePart = async (req, res) => {
  try {
    const sparePart = await SparePart.findById(req.params.id);
    if (!sparePart) return res.status(404).json({ message: 'Bulunamadı' });

    for (const img of sparePart.resimler) {
      try {
        await imagekit.deleteFile(img.public_id);
      } catch (e) {
        console.warn('Image delete skipped:', img.public_id, e?.message || e);
      }
    }

    await sparePart.deleteOne();
    res.status(200).json({ message: 'Silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silinemedi', error: String(err?.message || err) });
  }
};

module.exports = {
  addSparePart,
  updateSparePartById,
  getSparePartByIlanNo,
  getAllSpareParts,
  deleteSparePart,
  getSparePartById,
};
