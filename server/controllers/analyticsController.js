/**
 * Analytics Controller
 * ─────────────────────────────────────────────────────────────────
 * Returns summary statistics for the dashboard and analytics page.
 * Admin gets platform-wide stats; employees get their own.
 * ─────────────────────────────────────────────────────────────────
 */

const Workflow = require('../models/Workflow');
const Rule     = require('../models/Rule');
const AuditLog = require('../models/AuditLog');

/**
 * GET /api/analytics/summary
 * Returns KPI numbers for the dashboard cards.
 */
const getSummary = async (req, res) => {
  try {
    const isAdmin = (req.user.role === 'admin');

    // Build the filter for ownership
    const ownerFilter = isAdmin ? {} : { owner: req.user._id };

    // Count active workflows
    const activeWorkflows = await Workflow.countDocuments({
      ...ownerFilter,
      status: 'Active',
    });

    // Count all rules for this user
    const totalRules = await Rule.countDocuments(ownerFilter);

    // Count audit log events from today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const executionsToday = await AuditLog.countDocuments({
      event      : { $regex: '^workflow.executed', $options: 'i' },
      createdAt  : { $gte: startOfDay },
    });

    // Count failed executions
    const failedRuns = await AuditLog.countDocuments({
      event  : { $regex: '^execution.failed', $options: 'i' },
    });

    res.json({
      activeWorkflows,
      totalRules,
      executionsToday,
      failedRuns,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary };
