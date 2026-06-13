const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', [
  body('name').notEmpty().trim(),
  body('username').notEmpty().trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, username, email, password } = req.body;
    if (await User.findOne({ $or: [{ email }, { username }] }))
      return res.status(400).json({ message: 'Email or username already exists' });

    const user = await User.create({ name, username, email, password });
    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio } });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid credentials' });
    if (user.isRestricted) return res.status(403).json({ message: 'Your account has been restricted by admin' });

    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio } });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, (req, res) => res.json(req.user));

// Update profile
router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
  try {
    const updates = { name: req.body.name, bio: req.body.bio, username: req.body.username };
    if (req.file) updates.avatar = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
