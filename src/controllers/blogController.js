const BlogPost = require('../models/BlogPost');

// @desc    Obtener todos los posts del blog
// @route   GET /api/blog
// @access  Public
exports.getBlogPosts = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;
    
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (tag) query.tags = tag;

    const posts = await BlogPost.find(query)
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener un post por slug
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    // Incrementar vistas
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Crear nuevo post
// @route   POST /api/blog
// @access  Private
exports.createBlogPost = async (req, res) => {
  try {
    req.body.author = req.user._id;
    const post = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Actualizar post
// @route   PUT /api/blog/:id
// @access  Private
exports.updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Eliminar post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
exports.deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Post eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};