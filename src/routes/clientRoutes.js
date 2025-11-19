const express = require('express');
const router = express.Router();
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../config/upload');

// Rutas públicas
router.get('/', getClients);
router.get('/:id', getClient);

// Rutas protegidas (solo admin)
router.post('/', protect, admin, upload.single('logo'), createClient);
router.put('/:id', protect, admin, upload.single('logo'), updateClient);
router.delete('/:id', protect, admin, deleteClient);

module.exports = router;