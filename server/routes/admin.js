const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { adminAuth } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalPosts, totalComments, recentPosts, recentUsers] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments({ isDeleted: false }),
      Comment.countDocuments({ isDeleted: false }),
      Post.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).populate('author', 'name username avatar'),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
    ]);
    res.json({ totalUsers, totalPosts, totalComments, recentPosts, recentUsers });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot delete yourself' });
    await User.findByIdAndDelete(req.params.id);
    await Post.updateMany({ author: req.params.id }, { isDeleted: true });
    res.json({ message: 'User deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Restrict/Unrestrict user
router.put('/users/:id/restrict', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isRestricted = !user.isRestricted;
    await user.save();
    res.json({ message: `User ${user.isRestricted ? 'restricted' : 'unrestricted'}`, isRestricted: user.isRestricted });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Promote user to admin
router.put('/users/:id/promote', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' }, { new: true }).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts (admin)
router.get('/posts', adminAuth, async (req, res) => {
  try {
    const posts = await Post.find({ isDeleted: false }).populate('author', 'name username avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (admin)
router.delete('/posts/:id', adminAuth, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all comments (admin)
router.get('/comments', adminAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ isDeleted: false })
      .populate('author', 'name username')
      .populate('post', 'title')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment (admin)
router.delete('/comments/:id', adminAuth, async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
