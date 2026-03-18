/**
 * Workflow Model
 * ─────────────────────────────────────────────────────────────────
 * Represents an automated workflow process.
 *
 * Fields:
 *   name       — human-readable workflow name
 *   category   — e.g. "Finance · Approval", "HR · Onboarding"
 *   status     — Active | Paused | Draft
 *   trigger    — how the workflow starts (Webhook, Scheduled, etc.)
 *   priority   — Normal | High | Critical
 *   runs       — total number of times this workflow has executed
 *   lastRun    — timestamp of the most recent execution
 *   owner      — reference to the User who created it
 *   isTemplate — marks pre-built templates (visible to all users)
 * ─────────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type     : String,
      required : [true, 'Workflow name is required'],
      trim     : true,
    },

    category: {
      type    : String,
      default : 'General',
      trim    : true,
    },

    status: {
      type    : String,
      enum    : ['Active', 'Paused', 'Draft'],
      default : 'Draft',
    },

    trigger: {
      type    : String,
      enum    : ['Webhook', 'Scheduled', 'Manual', 'Form Submission'],
      default : 'Manual',
    },

    priority: {
      type    : String,
      enum    : ['Normal', 'High', 'Critical'],
      default : 'Normal',
    },

    // Total execution count — incremented each time the workflow runs
    runs: {
      type    : Number,
      default : 0,
      min     : 0,
    },

    // Timestamp of the last execution (null if never run)
    lastRun: {
      type    : Date,
      default : null,
    },

    // The user who owns / created this workflow
    owner: {
      type : mongoose.Schema.Types.ObjectId,
      ref  : 'User',
    },

    // Pre-built templates are visible to all users (not just the creator)
    isTemplate: {
      type    : Boolean,
      default : false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Workflow', workflowSchema);
