// models/SparePart.js
const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema(
  {
    ilanNo:       { type: String, required: true, unique: true, trim: true }, // unique index otomatik
    ilanBasligi:  { type: String, required: true, trim: true },
    ilanDetay:    { type: String, default: '' }, // HTML (backend'de sanitize edilecek)
    fiyat:        { type: Number },           // opsiyonel
    marka:        { type: String, trim: true }, // opsiyonel
    resimler: [
      { url: { type: String, required: true }, public_id: { type: String, required: true } }
    ],
    ilanGoruntulenme: { type: Number, default: 0 },
    ilanTarihi:       { type: Date, default: Date.now }
  },
  { timestamps: false, versionKey: false }

  
);


module.exports = mongoose.model('SparePart', sparePartSchema);
