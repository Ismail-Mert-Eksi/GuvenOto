// middlewares/uploadMiddleware.js
const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Sadece görsel dosyaları yükleyebilirsiniz.'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 8MB (istersen 5–10 arası ayarla)
  },
  fileFilter,
});

module.exports = upload;
