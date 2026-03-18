/**
 * ─────────────────────────────────────────────────────────────────
 * HR Workflow Platform — Express Server Entry Point
 * ─────────────────────────────────────────────────────────────────
 *
 * This file:
 *   1. Loads environment variables from .env
 *   2. Connects to MongoDB via Mongoose
 *   3. Registers all API route groups
 *   4. Starts the HTTP server
 *
 * API routes are split by resource:
 *   /api/auth       — login, register, get current user
 *   /api/workflows  — CRUD for workflows
 *   /api/rules      — CRUD for rules
 *   /api/auditlogs  — read + filter audit log entries
 *   /api/analytics  — summary stats for charts
 * ─────────────────────────────────────────────────────────────────
 */

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import route handlers
const authRoutes      = require('./routes/auth');
const workflowRoutes  = require('./routes/workflows');
const ruleRoutes      = require('./routes/rules');
const auditLogRoutes  = require('./routes/auditLogs');
const analyticsRoutes = require('./routes/analytics');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────

// Allow requests from the React dev server (and production build)
app.use(cors({
  origin      : process.env.CLIENT_URL || 'http://localhost:5173',
  credentials : true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ─── API Routes ───────────────────────────────────────────────────

app.use('/api/auth',       authRoutes);
app.use('/api/workflows',  workflowRoutes);
app.use('/api/rules',      ruleRoutes);
app.use('/api/auditlogs',  auditLogRoutes);
app.use('/api/analytics',  analyticsRoutes);

// Health-check endpoint — useful for deployment monitoring
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HR Workflow API is running' });
});

// ─── 404 handler for unknown routes ──────────────────────────────

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global error handler ─────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    message : err.message || 'Internal server error',
  });
});

// ─── Connect to MongoDB, then start the server ───────────────────

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
