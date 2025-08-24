const express = require('express');
const router = express.Router();
const {
  getCars,
  addCar,
  getCarById,
  updateCar,
  deleteCar, getCarByIlanNo
} = require('../controllers/carController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validateCar = require('../middleware/carValidator');
const { validationResult } = require('express-validator');

// GET /api/cars
router.get('/', getCars);
// İlanNo ile araç getirme
router.get('/ilan/:ilanNo', getCarByIlanNo);
// Tek araç detay (ID ile)
router.get('/:id', getCarById);





// Korunan rotalar (sadece admin erişebilir)
router.post(
  '/',
  verifyToken,
  upload.array('resimler', 10),
  validateCar,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // geçerli ise addCar'a gider
  },
  addCar
);

router.put(
  '/:id',
  verifyToken,
  upload.array('resimler', 10),
  validateCar,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateCar
);
router.delete('/:id', verifyToken, deleteCar);





module.exports = router;
