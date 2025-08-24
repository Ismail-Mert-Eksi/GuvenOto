const Counter = require('../models/Counter');

/**
 * Koleksiyon bazlı ilan numarası üretir.
 * @param {string} collectionName - sayaç tutulacak koleksiyon adı ('car', 'sparepart')
 * @param {object} options
 * @param {number} [options.pad=6] - numara uzunluğu (sıfır doldurma)
 * @param {string} [options.prefix] - numara ön eki (örn: 'ARC-', 'YDK-')
 * @returns {Promise<string>} - üretilen ilanNo
 */
async function getNextIlanNo(collectionName, { pad = 6, prefix } = {}) {
  if (!collectionName) {
    throw new Error('collectionName gerekli');
  }

  // Otomatik prefix belirleme
  if (!prefix) {
    if (collectionName === 'car') prefix = 'ARC-';
    else if (collectionName === 'sparepart') prefix = 'YDK-';
    else prefix = '';
  }

  // Sayaçtan sıradaki numarayı al veya oluştur
  const counter = await Counter.findOneAndUpdate(
    { name: collectionName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const num = String(counter.seq).padStart(pad, '0');
  return `${prefix}${num}`;
}

module.exports = getNextIlanNo;
