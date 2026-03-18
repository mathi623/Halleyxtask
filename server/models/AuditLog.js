/**
 * AuditLog Model
 * ─────────────────────────────────────────────────────────────────
 * Tamper-proof record of every action taken on the platform.
 *
 * Entries are created automatically by the backend whenever:
 *   - A user logs in or out
 *   - A workflow is created, updated, deleted, or executed
 *   - A rule is created, toggled, or deleted
 *   - Settings are changed
 *
 * Audit log entries are never updated or deleted — append-only.
 * ─────────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    // Event identifier in dot notation e.g. "workflow.created", "auth.login"
    event: {
      type     : String,
      required : true,
      trim     : true,
    },

    // Who triggered the action (email address or "system")
    actor: {
      type    : String,
      default : 'system',
    },

    // Which module or workflow was affected
    module: {
      type    : String,
      default : '—',
    },

    // Outcome of the action
    status: {
      type : String,
      enum : ['success', 'error', 'warning', 'info'],
    },

    // Human-readable description of what happened
    details: {
      type    : String,
      default : '',
    },

    // Optional reference to the user who performed the action
    user: {
      type : mongoose.Schema.Types.ObjectId,
      ref  : 'User',
    },
  },
  {
    // createdAt is our audit timestamp — never allow updates
    timestamps : { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
