const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 'car', 'sparepart'
  seq: { type: Number, default: 10 },                    // sayaç değeri
});

module.exports = mongoose.model('Counter', counterSchema);
