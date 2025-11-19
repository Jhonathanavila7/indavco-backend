const CorporatePlan = require('../models/CorporatePlan');

// @desc    Obtener todos los planes corporativos
// @route   GET /api/corporate-plans
// @access  Public
exports.getCorporatePlans = async (req, res) => {
  try {
    const plans = await CorporatePlan.find({ isActive: true }).sort({ order: 1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener un plan por ID
// @route   GET /api/corporate-plans/:id
// @access  Public
exports.getCorporatePlan = async (req, res) => {
  try {
    const plan = await CorporatePlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan no encontrado'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Crear nuevo plan
// @route   POST /api/corporate-plans
// @access  Private/Admin
exports.createCorporatePlan = async (req, res) => {
  try {
    const plan = await CorporatePlan.create(req.body);

    res.status(201).json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Actualizar plan
// @route   PUT /api/corporate-plans/:id
// @access  Private/Admin
exports.updateCorporatePlan = async (req, res) => {
  try {
    const plan = await CorporatePlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan no encontrado'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Eliminar plan
// @route   DELETE /api/corporate-plans/:id
// @access  Private/Admin
exports.deleteCorporatePlan = async (req, res) => {
  try {
    const plan = await CorporatePlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Plan eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};