const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all public posts (with pagination & search)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 9, search, category, tag } = req.query;
    const query = { isDeleted: false, visibility: 'public' };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (tag) query.tags = tag;

    const posts = await Post.find(query)
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);
    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my posts (authenticated)
router.get('/my', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('author', 'name username avatar');
    res.json(posts);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name username avatar bio');
    if (!post || post.isDeleted) return res.status(404).json({ message: 'Post not found' });
    if (post.visibility === 'private') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(403).json({ message: 'This post is private' });
    }
    post.views += 1;
    await post.save();
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, content, excerpt, tags, category, visibility } = req.body;
    const post = await Post.create({
      title, content,
      excerpt: excerpt || content.substring(0, 150),
      coverImage: req.file ? `/uploads/${req.file.filename}` : '',
      tags: tags ? JSON.parse(tags) : [],
      category: category || 'General',
      visibility: visibility || 'public',
      author: req.user._id,
    });
    await post.populate('author', 'name username avatar');
    res.status(201).json(post);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post
router.put('/:id', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Unauthorized' });

    const { title, content, excerpt, tags, category, visibility } = req.body;
    const updates = { title, content, excerpt, category, visibility, tags: tags ? JSON.parse(tags) : post.tags };
    if (req.file) updates.coverImage = `/uploads/${req.file.filename}`;

    const updated = await Post.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('author', 'name username avatar');
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Unauthorized' });
    await Post.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const liked = post.likes.includes(req.user._id);
    if (liked) post.likes.pull(req.user._id);
    else post.likes.push(req.user._id);
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
