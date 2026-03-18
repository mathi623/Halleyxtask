/**
 * Audit Log Controller
 * ─────────────────────────────────────────────────────────────────
 * Admin-only: fetch and filter the full platform audit log.
 * ─────────────────────────────────────────────────────────────────
 */

const AuditLog = require('../models/AuditLog');

/**
 * GET /api/auditlogs
 * Returns audit log entries, most recent first.
 * Optional query param: ?filter=workflow  (filters by event prefix)
 */
const getAuditLogs = async (req, res) => {
  try {
    const { filter } = req.query;

    // Build the query — filter by event prefix if provided
    const query = filter && filter !== 'all'
      ? { event: { $regex: `^${filter}`, $options: 'i' } }
      : {};

    const logs = await AuditLog
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)                         // cap at 100 for performance
      .populate('user', 'name email');

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAuditLogs };
