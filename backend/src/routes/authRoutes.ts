const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('../middleware/validate');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });
}

router.post(
  '/register',
  [
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const normalizedEmail = String(email || '').trim().toLowerCase();

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email: normalizedEmail, passwordHash, favorites: [] });

      const token = signToken(user._id.toString());
      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          favorites: user.favorites,
          recentSearches: user.recentSearches || []
        }
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = signToken(user._id.toString());
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          favorites: user.favorites,
          recentSearches: user.recentSearches || []
        }
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
