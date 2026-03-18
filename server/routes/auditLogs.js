const express = require('express');
const router  = express.Router();

const { getAuditLogs }         = require('../controllers/auditLogController');
const { protect, adminOnly }   = require('../middleware/authMiddleware');

// GET /api/auditlogs — admin only
router.get('/', protect, adminOnly, getAuditLogs);

module.exports = router;
