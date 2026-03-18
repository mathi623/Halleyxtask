const express = require('express');
const router  = express.Router();

const {
  getWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
} = require('../controllers/workflowController');

const { protect } = require('../middleware/authMiddleware');

// All workflow routes require authentication
router.use(protect);

router.route('/')
  .get(getWorkflows)       // GET  /api/workflows
  .post(createWorkflow);   // POST /api/workflows

router.route('/:id')
  .patch(updateWorkflow)   // PATCH  /api/workflows/:id
  .delete(deleteWorkflow); // DELETE /api/workflows/:id

module.exports = router;
