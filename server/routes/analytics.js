const express = require('express');
const router  = express.Router();

const { getSummary } = require('../controllers/analyticsController');
const { protect }    = require('../middleware/authMiddleware');

// GET /api/analytics/summary — authenticated users
router.get('/summary', protect, getSummary);

module.exports = router;
