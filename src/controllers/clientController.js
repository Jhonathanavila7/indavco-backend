const Client = require('../models/Client');
const path = require('path');
const fs = require('fs');

// @desc    Obtener todos los clientes
// @route   GET /api/clients
// @access  Public
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ isActive: true }).sort({ order: 1 });

    res.json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener un cliente por ID
// @route   GET /api/clients/:id
// @access  Public
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Crear nuevo cliente
// @route   POST /api/clients
// @access  Private/Admin
exports.createClient = async (req, res) => {
  try {
    const { name, isActive, order } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Por favor sube el logo del cliente'
      });
    }

    const logoPath = `/uploads/${req.file.filename}`;

    const client = await Client.create({
      name,
      logo: logoPath,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Actualizar cliente
// @route   PUT /api/clients/:id
// @access  Private/Admin
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    const { name, isActive, order } = req.body;
    
    client.name = name || client.name;
    client.isActive = isActive !== undefined ? isActive : client.isActive;
    client.order = order !== undefined ? order : client.order;

    // Si hay nueva imagen, eliminar la anterior y actualizar
    if (req.file) {
      // Eliminar imagen anterior
      const oldImagePath = path.join(__dirname, '../../', client.logo);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      client.logo = `/uploads/${req.file.filename}`;
    }

    await client.save();

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Eliminar cliente
// @route   DELETE /api/clients/:id
// @access  Private/Admin
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Eliminar imagen del servidor
    const imagePath = path.join(__dirname, '../../', client.logo);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Client.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Cliente eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};