/**
 * Authentication Middleware
 * ─────────────────────────────────────────────────────────────────
 * Protects API routes by verifying the JWT token sent in the
 * Authorization header.
 *
 * Usage in routes:
 *   router.get('/protected', protect, controllerFunction)
 *   router.get('/admin-only', protect, adminOnly, controllerFunction)
 *
 * How it works:
 *   1. Reads the Bearer token from the Authorization header
 *   2. Verifies the token against JWT_SECRET
 *   3. Fetches the user from MongoDB and attaches them to req.user
 *   4. Calls next() to allow the request to continue
 * ─────────────────────────────────────────────────────────────────
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verifies the JWT token and attaches the user to req.user.
 * Returns 401 if no token is provided or the token is invalid.
 */
const protect = async (req, res, next) => {
  try {
    // Check the Authorization header for a Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorised — no token provided' });
    }

    // Extract the token part after "Bearer "
    const token = authHeader.split(' ')[1];

    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database (exclude the password field)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorised — user no longer exists' });
    }

    // Attach the user object to the request so controllers can use it
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorised — invalid or expired token' });
  }
};

/**
 * Role guard — only allows admins to proceed.
 * Must be used AFTER the protect middleware.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied — admin only' });
};

module.exports = { protect, adminOnly };
