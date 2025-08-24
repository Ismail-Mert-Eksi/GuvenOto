// controllers/filtersController.js
const Car = require('../models/Car');

/* ----------------------------- helpers ----------------------------- */

// Regex'e güvenli gömüm
const escapeRegex = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// vehicleType (tipi) koşulu
const matchVehicleType = (vehicleType) =>
  vehicleType ? { tipi: { $regex: `^${escapeRegex(vehicleType)}$`, $options: 'i' } } : {};

// Mongo pipeline içinde TR-normalizasyon (trim + TR harf sadeleştirme + toLower)
const normalizeTR = (fieldExpr) => {
  const trimmed = { $trim: { input: { $ifNull: [fieldExpr, ""] } } };
  const replaced = [
    ["İ", "i"], ["I", "i"], ["ı", "i"],
    ["Ş", "s"], ["ş", "s"],
    ["Ğ", "g"], ["ğ", "g"],
    ["Ü", "u"], ["ü", "u"],
    ["Ö", "o"], ["ö", "o"],
    ["Ç", "c"], ["ç", "c"]
  ].reduce(
    (acc, [from, to]) => ({ $replaceAll: { input: acc, find: from, replacement: to } }),
    trimmed
  );
  return { $toLower: replaced };
};

/* --------------------------- generic distinct --------------------------- */
/**
 * Tekil alanlar için (renk, kasaTipi, yakitTipi, vitesTipi)
 * - vehicleType ile opsiyonel kısıtlama
 * - TR-normalize ile tekilleştirme
 * - Görüntü adı olarak en sık kullanılan orijinal yazımı seçer
 */
const getDistinctValues = (field) => async (req, res) => {
  try {
    const { vehicleType } = req.query;
    const match = matchVehicleType(vehicleType);

    const rows = await Car.aggregate([
      { $match: match },
      { $addFields: { norm: normalizeTR(`$${field}`) } },
      { $group: { _id: { norm: "$norm", display: `$${field}` }, count: { $sum: 1 } } },
      { $sort: { "_id.norm": 1, count: -1 } },
      { $group: { _id: "$_id.norm", name: { $first: "$_id.display" } } },
      { $project: { _id: 0, name: 1 } },
      { $sort: { name: 1 } },
    ]);

    res.json(rows.map(r => r.name).filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: `${field} verisi alınamadı`, error });
  }
};

/* --------------------------- brands with count --------------------------- */
/**
 * Marka sayıları (case-insensitive + TR normalize)
 * Response: [{ name: 'BMW', count: 7 }, ...]
 */
const getBrandsWithCount = async (req, res) => {
  const { vehicleType } = req.query;

  try {
    const match = matchVehicleType(vehicleType);

    const result = await Car.aggregate([
      { $match: match },
      { $addFields: { normBrand: normalizeTR("$marka") } },
      { $group: { _id: { norm: "$normBrand", display: "$marka" }, count: { $sum: 1 } } },
      { $sort: { "_id.norm": 1, count: -1 } },
      { $group: { _id: "$_id.norm", name: { $first: "$_id.display" }, count: { $sum: "$count" } } },
      { $project: { _id: 0, name: 1, count: 1 } },
      { $sort: { name: 1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Marka sayıları yüklenemedi', error });
  }
};

/* ------------------------------ brand -> series ------------------------------ */
/**
 * Seçili markanın serileri (case-insensitive + TR normalize)
 * Response: ["3 Serisi", "5 Serisi", ...]
 */
const getSerilerByMarka = async (req, res) => {
  const { marka, vehicleType } = req.query;
  if (!marka) return res.status(400).json({ message: 'Marka parametresi gerekli' });

  try {
    const match = {
      ...matchVehicleType(vehicleType),
      marka: { $regex: `^${escapeRegex(marka)}$`, $options: 'i' },
    };

    const rows = await Car.aggregate([
      { $match: match },
      { $addFields: { normSeri: normalizeTR("$seri") } },
      { $group: { _id: { norm: "$normSeri", display: "$seri" }, count: { $sum: 1 } } },
      { $sort: { "_id.norm": 1, count: -1 } },
      { $group: { _id: "$_id.norm", name: { $first: "$_id.display" } } },
      { $project: { _id: 0, name: 1 } },
      { $sort: { name: 1 } },
    ]);

    res.status(200).json(rows.map(r => r.name).filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: 'Seriler alınamadı', error });
  }
};

/* -------------------------- brand + series -> models -------------------------- */
/**
 * Seçili marka + serinin modelleri (case-insensitive + TR normalize)
 * Response: ["320i", "520d", ...]
 */
const getModellerBySeri = async (req, res) => {
  const { marka, seri, vehicleType } = req.query;
  if (!marka || !seri) return res.status(400).json({ message: 'Marka ve seri parametreleri gerekli' });

  try {
    const match = {
      ...matchVehicleType(vehicleType),
      marka: { $regex: `^${escapeRegex(marka)}$`, $options: 'i' },
      seri:  { $regex: `^${escapeRegex(seri)}$`,  $options: 'i' },
    };

    const rows = await Car.aggregate([
      { $match: match },
      { $addFields: { normModel: normalizeTR("$model") } },
      { $group: { _id: { norm: "$normModel", display: "$model" }, count: { $sum: 1 } } },
      { $sort: { "_id.norm": 1, count: -1 } },
      { $group: { _id: "$_id.norm", name: { $first: "$_id.display" } } },
      { $project: { _id: 0, name: 1 } },
      { $sort: { name: 1 } },
    ]);

    res.status(200).json(rows.map(r => r.name).filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: 'Modeller alınamadı', error });
  }
};

module.exports = {
  // tekil alanlar
  getMarkalar: getDistinctValues('marka'),
  getRenkler: getDistinctValues('renk'),
  getKasaTipleri: getDistinctValues('kasaTipi'),
  getYakitTipleri: getDistinctValues('yakitTipi'),
  getVitesTipleri: getDistinctValues('vitesTipi'),

  // sayım + hiyerarşi
  getBrandsWithCount,
  getSerilerByMarka,
  getModellerBySeri,
};
