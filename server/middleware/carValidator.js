// middleware/carValidator.js
const { body } = require('express-validator');

const validateCar = [
  // ZORUNLU ALANLAR
  body('ilanBasligi')
    .notEmpty().withMessage('İlan başlığı zorunludur'),

  body('marka')
    .notEmpty().withMessage('Marka zorunludur'),

  body('tipi')
    .notEmpty().withMessage('Araç tipi zorunludur'),

  body('ilanDetay')
    .notEmpty().withMessage('İlan detayı zorunludur'),

  // OPSİYONEL ALANLAR
  body('model').optional({ checkFalsy: true }),
  body('seri').optional({ checkFalsy: true }),
  body('yil').optional({ checkFalsy: true })
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Yıl geçerli olmalıdır'),
  body('fiyat').optional({ checkFalsy: true }).isNumeric().withMessage('Fiyat sayı olmalıdır'),
  body('kilometre').optional({ checkFalsy: true }).isNumeric().withMessage('Kilometre sayı olmalıdır'),
  body('renk').optional({ checkFalsy: true }),
  body('vitesTipi').optional({ checkFalsy: true }),
  body('yakitTipi').optional({ checkFalsy: true }),
  body('motorHacmi').optional({ checkFalsy: true }),
  body('motorGucu').optional({ checkFalsy: true }).isNumeric().withMessage('Motor gücü sayı olmalıdır'),
  body('kasaTipi').optional({ checkFalsy: true }),
];

module.exports = validateCar;
