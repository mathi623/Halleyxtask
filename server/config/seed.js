const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const bcrypt   = require('bcryptjs');
const MONGO_URI = 'mongodb://127.0.0.1:27017/hr_workflow';

// Load environment variables
dotenv.config({ path: require('path').join(__dirname, '../.env') });
process.env.MONGO_URI = 'mongodb+srv://admin:Admin%40123@cluster0.3sqxfko.mongodb.net/hr_workflow?retryWrites=true&w=majority&appName=Cluster0';

// Import models
const User     = require('../models/User');
const Workflow = require('../models/Workflow');
const Rule     = require('../models/Rule');
const AuditLog = require('../models/AuditLog');

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {family: 4});
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Workflow.deleteMany({}),
      Rule.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Create Users ──────────────────────────────────────────────

    const adminUser = await User.create({
      name       : 'Administrator',
      email      : 'admin@company.com',
      password   : 'admin123',
      role       : 'admin',
      department : 'All Departments',
    });

    const employeeUser = await User.create({
      name       : 'Employee User',
      email      : 'employee@company.com',
      password   : 'emp123',
      role       : 'employee',
      department : 'Finance',
    });

    console.log('👤 Users created');

    // ── Create Workflows ──────────────────────────────────────────

    const workflows = await Workflow.insertMany([
      {
        name       : 'Invoice Approval',
        category   : 'Finance · Approval',
        status     : 'Active',
        trigger    : 'Webhook',
        priority   : 'High',
        runs       : 8231,
        lastRun    : new Date(Date.now() - 12 * 60 * 1000),
        owner      : adminUser._id,
        isTemplate : true,
      },
      {
        name       : 'Employee Onboarding',
        category   : 'HR · Onboarding',
        status     : 'Active',
        trigger    : 'Manual',
        priority   : 'Normal',
        runs       : 4890,
        lastRun    : new Date(Date.now() - 60 * 60 * 1000),
        owner      : adminUser._id,
        isTemplate : true,
      },
      {
        name       : 'Data Sync Pipeline',
        category   : 'IT · Processing',
        status     : 'Paused',
        trigger    : 'Scheduled',
        priority   : 'Normal',
        runs       : 6104,
        lastRun    : new Date(Date.now() - 45 * 60 * 1000),
        owner      : adminUser._id,
        isTemplate : false,
      },
      {
        name       : 'Deploy Notification',
        category   : 'DevOps · Notify',
        status     : 'Active',
        trigger    : 'Webhook',
        priority   : 'Critical',
        runs       : 3210,
        lastRun    : new Date(Date.now() - 3 * 60 * 60 * 1000),
        owner      : adminUser._id,
        isTemplate : true,
      },
      {
        name       : 'ETL Job',
        category   : 'IT · Processing',
        status     : 'Active',
        trigger    : 'Scheduled',
        priority   : 'Normal',
        runs       : 1890,
        lastRun    : new Date(Date.now() - 6 * 60 * 60 * 1000),
        owner      : adminUser._id,
        isTemplate : false,
      },
      {
        name       : 'Leave Request Flow',
        category   : 'HR · Approval',
        status     : 'Draft',
        trigger    : 'Form Submission',
        priority   : 'Normal',
        runs       : 980,
        lastRun    : null,
        owner      : employeeUser._id,
        isTemplate : true,
      },
      {
        name       : 'Monthly HR Report',
        category   : 'Reporting',
        status     : 'Active',
        trigger    : 'Scheduled',
        priority   : 'Normal',
        runs       : 24,
        lastRun    : new Date(Date.now() - 24 * 60 * 60 * 1000),
        owner      : adminUser._id,
        isTemplate : false,
      },
    ]);

    console.log('⚡ Workflows created');

    // ── Create Rules ──────────────────────────────────────────────

    await Rule.insertMany([
      {
        name       : 'High Value Invoice',
        field      : 'invoice.amount',
        operator   : 'greater_than',
        value      : '5000',
        action     : 'Require Manager Approval',
        workflow   : 'Invoice Approval',
        enabled    : true,
        owner      : adminUser._id,
        isTemplate : true,
      },
      {
        name       : 'New Employee Start',
        field      : 'employee.status',
        operator   : 'equals',
        value      : 'onboarding',
        action     : 'Send Slack Notification',
        workflow   : 'Employee Onboarding',
        enabled    : true,
        owner      : adminUser._id,
        isTemplate : true,
      },
      {
        name       : 'Critical Deployment',
        field      : 'request.priority',
        operator   : 'equals',
        value      : 'critical',
        action     : 'Escalate to HR Director',
        workflow   : 'Deploy Notification',
        enabled    : false,
        owner      : adminUser._id,
        isTemplate : false,
      },
      {
        name       : 'Long Leave Request',
        field      : 'leave.days',
        operator   : 'greater_than',
        value      : '5',
        action     : 'Escalate to HR Director',
        workflow   : 'Leave Request Flow',
        enabled    : true,
        owner      : employeeUser._id,
        isTemplate : true,
      },
    ]);

    console.log('🎯 Rules created');

    // ── Create Audit Log entries ───────────────────────────────────

    await AuditLog.insertMany([
      { event: 'workflow.executed', actor: 'system',             module: 'Invoice Approval',    status: 'success', details: '34th execution today',               user: adminUser._id,    createdAt: new Date(Date.now() - 12  * 60 * 1000) },
      { event: 'rule.updated',      actor: 'admin@company.com',  module: 'Rule Builder',        status: 'info',    details: 'Rule #14 threshold changed to 5000',  user: adminUser._id,    createdAt: new Date(Date.now() - 20  * 60 * 1000) },
      { event: 'workflow.paused',   actor: 'dev.ops',            module: 'Data Sync Pipeline',  status: 'warning', details: 'Manually paused for maintenance',      user: adminUser._id,    createdAt: new Date(Date.now() - 45  * 60 * 1000) },
      { event: 'execution.failed',  actor: 'system',             module: 'ETL Job',             status: 'error',   details: 'Connection timeout after 30s',         user: adminUser._id,    createdAt: new Date(Date.now() - 60  * 60 * 1000) },
      { event: 'workflow.deployed', actor: 'ops.team',           module: 'Deploy Notification', status: 'success', details: 'Version 2.1.4 deployed',               user: adminUser._id,    createdAt: new Date(Date.now() - 120 * 60 * 1000) },
      { event: 'rule.created',      actor: 'admin@company.com',  module: 'Rule Builder',        status: 'info',    details: 'Critical Alert rule created',          user: adminUser._id,    createdAt: new Date(Date.now() - 130 * 60 * 1000) },
      { event: 'workflow.executed', actor: 'system',             module: 'Employee Onboarding', status: 'success', details: 'Triggered via webhook integration',    user: adminUser._id,    createdAt: new Date(Date.now() - 150 * 60 * 1000) },
      { event: 'auth.login',        actor: 'dev.ops',            module: '—',                  status: 'info',    details: 'Login from 192.168.1.4 (Office VPN)',  user: adminUser._id,    createdAt: new Date(Date.now() - 165 * 60 * 1000) },
      { event: 'rule.deleted',      actor: 'admin@company.com',  module: 'Rule Builder',        status: 'warning', details: 'Obsolete rule #7 removed',             user: adminUser._id,    createdAt: new Date(Date.now() - 180 * 60 * 1000) },
      { event: 'workflow.executed', actor: 'system',             module: 'Invoice Approval',    status: 'success', details: 'Batch processed: 12 invoices',         user: adminUser._id,    createdAt: new Date(Date.now() - 196 * 60 * 1000) },
      { event: 'settings.updated',  actor: 'admin@company.com',  module: 'Settings',            status: 'info',    details: 'Notification preferences updated',     user: adminUser._id,    createdAt: new Date(Date.now() - 210 * 60 * 1000) },
      { event: 'auth.login',        actor: 'admin@company.com',  module: '—',                  status: 'info',    details: 'Login from 10.0.0.1 (Office)',         user: adminUser._id,    createdAt: new Date(Date.now() - 480 * 60 * 1000) },
    ]);

    console.log('📋 Audit log entries created');
    console.log('\n✅ Database seeded successfully!\n');
    console.log('Demo credentials:');
    console.log('  Admin    →  admin@company.com   / admin123');
    console.log('  Employee →  employee@company.com / emp123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
