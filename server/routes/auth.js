const express = require('express');
const router  = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { protect }                 = require('../middleware/authMiddleware');

// POST /api/auth/register — create a new account
router.post('/register', register);

// POST /api/auth/login — login and receive a JWT
router.post('/login', login);

// GET /api/auth/me — get the current user's profile (protected)
router.get('/me', protect, getMe);

module.exports = router;
