const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

// Get user profile by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const posts = await Post.find({ author: user._id, isDeleted: false, visibility: 'public' }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow / Unfollow
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const isFollowing = req.user.following.includes(req.params.id);
    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
      await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } });
      await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } });
    }
    res.json({ following: !isFollowing });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
