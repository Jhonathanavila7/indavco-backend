const express = require('express');
const router = express.Router();
const {
  getCorporatePlans,
  getCorporatePlan,
  createCorporatePlan,
  updateCorporatePlan,
  deleteCorporatePlan
} = require('../controllers/corporatePlanController');
const { protect, admin } = require('../middleware/auth');

// Rutas públicas
router.get('/', getCorporatePlans);
router.get('/:id', getCorporatePlan);

// Rutas protegidas (solo admin)
router.post('/', protect, admin, createCorporatePlan);
router.put('/:id', protect, admin, updateCorporatePlan);
router.delete('/:id', protect, admin, deleteCorporatePlan);

module.exports = router;