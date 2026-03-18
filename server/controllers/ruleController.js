/**
 * Rules Controller
 * ─────────────────────────────────────────────────────────────────
 * Handles CRUD operations for automation rules.
 * ─────────────────────────────────────────────────────────────────
 */

const Rule     = require('../models/Rule');
const AuditLog = require('../models/AuditLog');

/**
 * GET /api/rules
 * Returns rules visible to the logged-in user.
 */
const getRules = async (req, res) => {
  try {
    let rules;
    if (req.user.role === 'admin') {
      rules = await Rule.find().populate('owner', 'name email');
    } else {
      rules = await Rule.find({
        $or: [{ owner: req.user._id }, { isTemplate: true }],
      }).populate('owner', 'name email');
    }
    res.json({ rules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/rules
 * Creates a new rule.
 */
const createRule = async (req, res) => {
  try {
    const { name, field, operator, value, action, workflow } = req.body;

    const rule = await Rule.create({
      name, field, operator, value, action,
      workflow : workflow || '',
      enabled  : true,
      owner    : req.user._id,
    });

    await AuditLog.create({
      event   : 'rule.created',
      actor   : req.user.email,
      module  : 'Rule Builder',
      status  : 'success',
      details : `Rule "${name}" created`,
      user    : req.user._id,
    });

    res.status(201).json({ message: 'Rule created', rule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/rules/:id
 * Updates a rule (e.g. toggling enabled state).
 */
const updateRule = async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: 'Rule not found' });

    const isOwner = rule.owner.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Not authorised to edit this rule' });
    }

    const updated = await Rule.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    await AuditLog.create({
      event   : 'rule.updated',
      actor   : req.user.email,
      module  : 'Rule Builder',
      status  : 'info',
      details : `Rule "${rule.name}" updated`,
      user    : req.user._id,
    });

    res.json({ message: 'Rule updated', rule: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/rules/:id
 * Deletes a rule.
 */
const deleteRule = async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) return res.status(404).json({ message: 'Rule not found' });

    const isOwner = rule.owner.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Not authorised to delete this rule' });
    }

    await rule.deleteOne();

    await AuditLog.create({
      event   : 'rule.deleted',
      actor   : req.user.email,
      module  : 'Rule Builder',
      status  : 'warning',
      details : `Rule "${rule.name}" deleted`,
      user    : req.user._id,
    });

    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRules, createRule, updateRule, deleteRule };
