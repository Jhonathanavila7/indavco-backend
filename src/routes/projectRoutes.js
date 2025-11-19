const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');

// Rutas públicas
router.get('/', getProjects);
router.get('/:id', getProject);

// Rutas protegidas (solo admin)
router.post('/', protect, admin, createProject);
router.put('/:id', protect, admin, updateProject);
router.delete('/:id', protect, admin, deleteProject);

module.exports = router;