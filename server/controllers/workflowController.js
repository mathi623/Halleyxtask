/**
 * Workflow Controller
 * ─────────────────────────────────────────────────────────────────
 * Handles all CRUD operations for workflows.
 *
 * Admin  — can see all workflows
 * Employee — can only see their own workflows + templates
 * ─────────────────────────────────────────────────────────────────
 */

const Workflow = require('../models/Workflow');
const AuditLog = require('../models/AuditLog');

/**
 * GET /api/workflows
 * Returns workflows visible to the logged-in user.
 * Admins get everything. Employees get only their own + templates.
 */
const getWorkflows = async (req, res) => {
  try {
    let query;

    if (req.user.role === 'admin') {
      // Admins see all workflows
      query = Workflow.find().populate('owner', 'name email');
    } else {
      // Employees see their own workflows and pre-built templates
      query = Workflow.find({
        $or: [
          { owner: req.user._id },
          { isTemplate: true },
        ],
      }).populate('owner', 'name email');
    }

    const workflows = await query.sort({ createdAt: -1 });
    res.json({ workflows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/workflows
 * Creates a new workflow.
 * Body: { name, category, status, trigger, priority }
 */
const createWorkflow = async (req, res) => {
  try {
    const { name, category, status, trigger, priority } = req.body;

    const workflow = await Workflow.create({
      name,
      category,
      status   : status   || 'Draft',
      trigger  : trigger  || 'Manual',
      priority : priority || 'Normal',
      owner    : req.user._id,
    });

    // Log the creation
    await AuditLog.create({
      event   : 'workflow.created',
      actor   : req.user.email,
      module  : name,
      status  : 'success',
      details : `New workflow "${name}" created`,
      user    : req.user._id,
    });

    res.status(201).json({ message: 'Workflow created', workflow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/workflows/:id
 * Updates a workflow's fields.
 * Users can only update their own workflows (admins can update any).
 */
const updateWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    // Employees can only edit their own workflows
    const isOwner = workflow.owner.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Not authorised to edit this workflow' });
    }

    const updated = await Workflow.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    await AuditLog.create({
      event   : 'workflow.updated',
      actor   : req.user.email,
      module  : workflow.name,
      status  : 'info',
      details : `Workflow "${workflow.name}" updated`,
      user    : req.user._id,
    });

    res.json({ message: 'Workflow updated', workflow: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/workflows/:id
 * Deletes a workflow. Admins can delete any; employees only their own.
 */
const deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    const isOwner = workflow.owner.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Not authorised to delete this workflow' });
    }

    await workflow.deleteOne();

    await AuditLog.create({
      event   : 'workflow.deleted',
      actor   : req.user.email,
      module  : workflow.name,
      status  : 'warning',
      details : `Workflow "${workflow.name}" deleted`,
      user    : req.user._id,
    });

    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow };
