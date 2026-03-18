/**
 * Auth Controller
 * ─────────────────────────────────────────────────────────────────
 * Handles user registration, login, and fetching the current user.
 *
 * Functions:
 *   register  — creates a new user account
 *   login     — validates credentials and returns a JWT
 *   getMe     — returns the currently logged-in user's profile
 * ─────────────────────────────────────────────────────────────────
 */

const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const AuditLog = require('../models/AuditLog');

/**
 * Generates a signed JWT token for the given user ID.
 * The token expires after the duration set in JWT_EXPIRES_IN.
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * POST /api/auth/register
 * Creates a new user account.
 *
 * Body: { name, email, password, role, department }
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Create the user — password is hashed by the pre-save hook in the model
    const user = await User.create({ name, email, password, role, department });

    // Write an audit entry for the new registration
    await AuditLog.create({
      event   : 'auth.register',
      actor   : email,
      module  : 'Authentication',
      status  : 'success',
      details : `New ${role} account created`,
      user    : user._id,
    });

    res.status(201).json({
      message : 'Account created successfully',
      token   : generateToken(user._id),
      user    : {
        id         : user._id,
        name       : user.name,
        email      : user.email,
        role       : user.role,
        department : user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/auth/login
 * Validates email + password and returns a JWT on success.
 *
 * Body: { email, password }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Both fields are required
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user — we need the password field for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the submitted password against the stored hash
    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Record the login in the audit log
    await AuditLog.create({
      event   : 'auth.login',
      actor   : email,
      module  : '—',
      status  : 'info',
      details : `Login from ${req.ip || 'unknown IP'}`,
      user    : user._id,
    });

    res.json({
      message : 'Login successful',
      token   : generateToken(user._id),
      user    : {
        id         : user._id,
        name       : user.name,
        email      : user.email,
        role       : user.role,
        department : user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 * Protected — requires a valid JWT via the protect middleware.
 */
const getMe = async (req, res) => {
  // req.user is attached by the protect middleware
  res.json({
    user: {
      id         : req.user._id,
      name       : req.user.name,
      email      : req.user.email,
      role       : req.user.role,
      department : req.user.department,
    },
  });
};

module.exports = { register, login, getMe };
