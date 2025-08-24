// controllers/carController.js
const Car = require('../models/Car');
const imagekit = require("../utils/imagekit");
const getNextIlanNo = require('../utils/getNextIlanNo');
const { cleanHtml } = require('../utils/cleanHtml');
const sharp = require('sharp'); 

// "12.500" -> 12500 gibi TR formatlarını tolere eden parse
function toNumberSafe(v) {
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') return undefined;
  const s = v.replace(/\./g, '').replace(/,/g, '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

// Tüm araçları sayfalama ve filtreleme ile getir
const getCars = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    marka,
    model,
    seri,
    fiyatMin,
    fiyatMax,
    yilMin,
    yilMax,
    kilometreMin,
    kilometreMax,
    vitesTipi,
    yakitTipi,
    motorHacmi,
    motorGucu,
    tipi,
    kasaTipi,
    renk,
    modifiye,
    klasik,
    acil,
    anahtarKelime,
    sort
  } = req.query;

  const filter = {};

  if (marka) filter.marka = { $regex: marka, $options: 'i' };
  if (model) filter.model = { $regex: model, $options: 'i' };
  if (seri) filter.seri = { $regex: seri, $options: 'i' };
  if (tipi) filter.tipi = { $regex: tipi, $options: 'i' };
  if (kasaTipi) filter.kasaTipi = { $regex: kasaTipi, $options: 'i' };
  if (renk) filter.renk = { $regex: renk, $options: 'i' };
  if (vitesTipi) filter.vitesTipi = vitesTipi;
  if (yakitTipi) filter.yakitTipi = yakitTipi;
  if (motorHacmi) filter.motorHacmi = motorHacmi;
  if (motorGucu) filter.motorGucu = motorGucu;
  if (modifiye === 'true') filter.modifiye = true;
  if (klasik === 'true') filter.klasik = true;
  if (acil === 'true') filter.acil = true;

  if (fiyatMin || fiyatMax) {
    filter.fiyat = {};
    if (fiyatMin) filter.fiyat.$gte = Number(fiyatMin);
    if (fiyatMax) filter.fiyat.$lte = Number(fiyatMax);
  }

  if (yilMin || yilMax) {
    filter.yil = {};
    if (yilMin) filter.yil.$gte = Number(yilMin);
    if (yilMax) filter.yil.$lte = Number(yilMax);
  }

  if (kilometreMin || kilometreMax) {
    filter.kilometre = {};
    if (kilometreMin) filter.kilometre.$gte = Number(kilometreMin);
    if (kilometreMax) filter.kilometre.$lte = Number(kilometreMax);
  }

  if (anahtarKelime) {
    filter.$or = [
      { ilanNo: { $regex: anahtarKelime, $options: 'i' } },
      { model: { $regex: anahtarKelime, $options: 'i' } },
      { seri: { $regex: anahtarKelime, $options: 'i' } },
      { marka: { $regex: anahtarKelime, $options: 'i' } },
    ];
  }

  let sortOption = {};
  if (sort) {
    const [field, order] = sort.split(':');
    sortOption[field] = order === 'desc' ? -1 : 1;
  } else {
    sortOption = { ilanTarihi: -1 };
  }

  try {
    const cars = await Car.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Car.countDocuments(filter);

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: cars,
    });
  } catch (error) {
    console.error("Araçlar getirilemedi:", error);
    res.status(500).json({ message: "Araçlar getirilemedi", error });
  }
};


// Yeni araç ekle (çoklu resim yükleme)
const addCar = async (req, res) => { 
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'En az bir resim yüklemelisiniz.' });
    }

    // koleksiyon bazlı ilan no
    const ilanNo = await getNextIlanNo('car', { pad: 6, prefix: 'ARC-' });

    // ilanDetay sanitize
    if (typeof req.body.ilanDetay === 'string') {
      req.body.ilanDetay = cleanHtml(req.body.ilanDetay);
      if (req.body.ilanDetay.length > 100000) {
        return res.status(413).json({ message: 'İlan detayı çok büyük.' });
      }
    }

    // --- FİYAT NORMALİZASYONU ---
    // hedef: "0, boş string, undefined" -> null; geçersiz format -> 400
    if ('fiyat' in req.body) {
      const raw = req.body.fiyat;

      // toNumberSafe senin util'in: sayıya çevirebiliyorsa number döndürür, yoksa undefined
      const parsed = toNumberSafe(raw);

      // Kullanıcı bilinçli olarak boş bıraktıysa -> null
      if (raw === '' || raw === undefined || raw === null) {
        req.body.fiyat = null;
      } else if (parsed === undefined) {
        // "12a3" gibi geçersiz formatlar
        return res.status(400).json({ message: 'Geçersiz fiyat formatı.' });
      } else {
        // 0 veya negatif ise null; pozitifse sayı
        req.body.fiyat = parsed > 0 ? parsed : null;
      }
    } else {
      // hiç gönderilmediyse de null
      req.body.fiyat = null;
    }
    // --- /FİYAT NORMALİZASYONU ---

    // 🔥 Görselleri optimize edip paralel yükle
    const imageInfos = await Promise.all(
      files.map(async (file) => {
        const optimizedBuffer = await sharp(file.buffer)
          .rotate()
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        const baseName = file.originalname.replace(/\.\w+$/, '');
        const result = await imagekit.upload({
          file: optimizedBuffer,
          fileName: `${baseName}.webp`,
          folder: 'guvenoto',
        });

        return { url: result.url, public_id: result.fileId };
      })
    );

    const newCar = new Car({
      ...req.body,
      ilanNo,
      resimler: imageInfos,
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    console.error('Araç eklenemedi:', error);
    res.status(400).json({ message: 'Araç eklenemedi', error });
  }
};







// ID ile araç getirme (görüntülenme artırmaz) - Admin kullanımına uygun
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Araç bulunamadı' });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Araç getirilemedi', error });
  }
};

// ilanNo ile araç getirme (+ görüntülenme sayacı artır)
const getCarByIlanNo = async (req, res) => {
  try {
    const car = await Car.findOneAndUpdate(
      { ilanNo: req.params.ilanNo },
      { $inc: { ilanGoruntulenme: 1 } },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'İlan getirilemedi', error });
  }
};

// ID ile araç güncelleme
const updateCar = async (req, res) => { 
  try {
    const carId = req.params.id;
    const files = req.files;
    let silinecekResimler = req.body.silinecekResimler || [];

    // ilanNo değiştirilemez
    if ('ilanNo' in req.body) delete req.body.ilanNo;

    if (typeof silinecekResimler === 'string') {
      silinecekResimler = [silinecekResimler];
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Araç bulunamadı" });
    }

    // ilanDetay sanitize
    if (typeof req.body.ilanDetay === 'string') {
      req.body.ilanDetay = cleanHtml(req.body.ilanDetay);
      if (req.body.ilanDetay.length > 100000) {
        return res.status(413).json({ message: 'İlan detayı çok büyük.' });
      }
    }

    // --- FİYAT NORMALİZASYONU ---
    // hedef: "0, boş, undefined" -> null; geçersiz format -> 400; pozitif ise number
    if ('fiyat' in req.body) {
      const raw = req.body.fiyat;
      const parsed = toNumberSafe(raw); // sayıya çevrilebiliyorsa number döner, aksi halde undefined

      if (raw === '' || raw === undefined || raw === null) {
        req.body.fiyat = null;
      } else if (parsed === undefined) {
        return res.status(400).json({ message: 'Geçersiz fiyat formatı.' });
      } else {
        req.body.fiyat = parsed > 0 ? parsed : null;
      }
    }
    // --- /FİYAT NORMALİZASYONU ---

    // 1) Belirli resimleri sil
    if (Array.isArray(silinecekResimler) && silinecekResimler.length > 0) {
      for (const fileId of silinecekResimler) {
        try {
          await imagekit.deleteFile(fileId);
        } catch (e) {
          console.warn('Image delete skipped:', fileId, e?.message || e);
        }
      }
      car.resimler = car.resimler.filter(
        (img) => !silinecekResimler.includes(img.public_id)
      );
    }

    // 2) Yeni resimleri paralel yükle (OPTİMİZE EDİLEREK)
    if (files && files.length > 0) {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const optimizedBuffer = await sharp(file.buffer)
            .rotate()
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          const baseName = file.originalname.replace(/\.\w+$/, '');
          const result = await imagekit.upload({
            file: optimizedBuffer,
            fileName: `${baseName}.webp`,
            folder: "guvenoto",
          });

          return { url: result.url, public_id: result.fileId };
        })
      );

      // Duplicate kontrolü
      for (const img of newImages) {
        if (!car.resimler.some(x => x.public_id === img.public_id)) {
          car.resimler.push(img);
        }
      }
    }

    // 3) Diğer alanları güncelle (resimler zaten güncellendi)
    Object.assign(car, req.body);

    await car.save();
    res.status(200).json(car);
  } catch (error) {
    console.error("Araç güncellenemedi:", error);
    res.status(500).json({ message: "Araç güncellenemedi", error });
  }
};





// ID ile araç silme
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Araç bulunamadı" });
    }

    for (const img of car.resimler) {
      try {
        await imagekit.deleteFile(img.public_id);
      } catch (e) {
        console.warn('Image delete skipped:', img.public_id, e?.message || e);
      }
    }

    await car.deleteOne();
    res.status(200).json({ message: "Araç ve resimleri başarıyla silindi." });
  } catch (error) {
    console.error("Araç silinemedi:", error);
    res.status(500).json({ message: "Araç silinemedi", error });
  }
};

module.exports = {
  getCars,
  addCar,
  getCarById,
  updateCar,
  deleteCar,
  getCarByIlanNo
};
