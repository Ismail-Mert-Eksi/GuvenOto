const express = require('express');
const router = express.Router();
const filters = require('../controllers/filtersController');
const Car = require('../models/Car');

router.get('/markalar', filters.getMarkalar);
router.get('/seriler', filters.getSerilerByMarka);
router.get('/modeller', filters.getModellerBySeri);
router.get('/renkler', filters.getRenkler);
router.get('/kasaTipleri', filters.getKasaTipleri);
router.get('/yakitTipleri', filters.getYakitTipleri);
router.get('/vitesTipleri', filters.getVitesTipleri);
router.get('/marka-sayilari', filters.getBrandsWithCount);

module.exports = router;
