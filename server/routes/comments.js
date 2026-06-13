const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, isDeleted: false, parentComment: null })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 });

    const withReplies = await Promise.all(comments.map(async (c) => {
      const replies = await Comment.find({ parentComment: c._id, isDeleted: false })
        .populate('author', 'name username avatar')
        .sort({ createdAt: 1 });
      return { ...c.toObject(), replies };
    }));
    res.json(withReplies);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:postId', auth, async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user._id,
      post: req.params.postId,
      parentComment: req.body.parentComment || null,
    });
    await comment.populate('author', 'name username avatar');
    res.status(201).json(comment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Unauthorized' });
    await Comment.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
