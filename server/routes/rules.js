const express = require('express');
const router  = express.Router();

const {
  getRules,
  createRule,
  updateRule,
  deleteRule,
} = require('../controllers/ruleController');

const { protect } = require('../middleware/authMiddleware');

// All rule routes require authentication
router.use(protect);

router.route('/')
  .get(getRules)     // GET  /api/rules
  .post(createRule); // POST /api/rules

router.route('/:id')
  .patch(updateRule)   // PATCH  /api/rules/:id
  .delete(deleteRule); // DELETE /api/rules/:id

module.exports = router;
