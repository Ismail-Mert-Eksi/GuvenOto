const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    ilanNo: { type: String, required: true, unique: true },
    ilanTarihi: { type: Date, default: Date.now },
    ilanBasligi: { type: String, required: true },
    marka: { type: String, required: true },

    model: { type: String },
    seri: { type: String },
    yil: { type: Number },
    kilometre: { type: Number },
    renk: { type: String },
    tipi: { type: String },
    yakitTipi: { type: String },
    motorHacmi: { type: String },
    motorGucu: { type: String },
    vitesTipi: { type: String },
    kasaTipi: { type: String },

    modifiye: { type: Boolean, default: false },
    klasik: { type: Boolean, default: false },
    acil: { type: Boolean, default: false },

    ilanDetay: { type: String },
    ilanGoruntulenme: { type: Number, default: 0 },
    fiyat: { type: Number, min: 0, default: null, set: v => (v == null || Number(v) <= 0 ? null : Number(v)),},

    resimler: {
      type: [{ url: { type: String, required: true }, public_id: { type: String, required: true } }],
      default: [],
    },
  },
  { timestamps: true }
);

/* Indexler */
// En yeniler
carSchema.index({ ilanTarihi: -1 });

// Marka/Seri/Model + farklı sıralamalar
carSchema.index({ marka: 1, seri: 1, model: 1, ilanTarihi: -1 });
carSchema.index({ marka: 1, seri: 1, model: 1, fiyat: 1 });
carSchema.index({ marka: 1, seri: 1, model: 1, yil: 1 });
carSchema.index({ marka: 1, seri: 1, model: 1, kilometre: 1 });

// Aralıklar (marka/seri/model olmadan da hızlı olsun diye)
carSchema.index({ fiyat: 1 }, { partialFilterExpression: { fiyat: { $gt: 0 } } });
carSchema.index({ yil: 1 });
carSchema.index({ kilometre: 1 });

// Vitrin
carSchema.index({ acil: 1, ilanTarihi: -1 });
carSchema.index({ klasik: 1, ilanTarihi: -1 });
carSchema.index({ modifiye: 1, ilanTarihi: -1 });

// Text search (ilanNo dahil değil)
carSchema.index(
  { marka: "text", model: "text", seri: "text" },
  { name: "fts_ilans" }
);

module.exports = mongoose.model("Car", carSchema);
