// routes/hierarchyRoutes.js
const express = require('express');
const router = express.Router();
const {getMarkaSeriModelHierarchyWithCounts } = require('../controllers/hierarchyController');

router.get('/hierarchy', getMarkaSeriModelHierarchyWithCounts);

module.exports = router;
