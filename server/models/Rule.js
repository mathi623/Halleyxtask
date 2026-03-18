/**
 * Rule Model
 * ─────────────────────────────────────────────────────────────────
 * Represents a single automation rule that runs within a workflow.
 *
 * A rule defines: IF (field operator value) THEN (action)
 *
 * Example:
 *   IF invoice.amount greater_than 5000
 *   THEN Require Manager Approval
 *   APPLIED TO Invoice Approval workflow
 * ─────────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema(
  {
    name: {
      type     : String,
      required : [true, 'Rule name is required'],
      trim     : true,
    },

    // The data field being evaluated (e.g. "invoice.amount")
    field: {
      type     : String,
      required : [true, 'Condition field is required'],
    },

    // The comparison operator
    operator: {
      type : String,
      enum : ['greater_than', 'less_than', 'equals', 'not_equals', 'contains'],
    },

    // The value to compare against
    value: {
      type     : String,
      required : [true, 'Condition value is required'],
    },

    // What happens when the condition is true
    action: {
      type     : String,
      required : [true, 'Action is required'],
    },

    // The name of the workflow this rule is applied to
    workflow: {
      type : String,
      default: '',
    },

    // Whether this rule is currently active
    enabled: {
      type    : Boolean,
      default : true,
    },

    // The user who owns this rule
    owner: {
      type : mongoose.Schema.Types.ObjectId,
      ref  : 'User',
    },

    // Pre-built templates visible to all users
    isTemplate: {
      type    : Boolean,
      default : false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Rule', ruleSchema);
