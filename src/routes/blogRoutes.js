const express = require('express');
const router = express.Router();
const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/auth');

// Rutas públicas
router.get('/', getBlogPosts);
router.get('/:slug', getBlogPost);

// Rutas protegidas
router.post('/', protect, createBlogPost);
router.put('/:id', protect, updateBlogPost);
router.delete('/:id', protect, admin, deleteBlogPost);

module.exports = router;