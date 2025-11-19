const mongoose = require('mongoose');

const corporatePlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del plan es requerido'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  billingPeriod: {
    type: String,
    enum: ['monthly', 'yearly', 'one-time'],
    default: 'monthly'
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  recommended: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  maxUsers: {
    type: Number
  },
  support: {
    type: String,
    enum: ['básico', 'prioritario', '24/7'],
    default: 'básico'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CorporatePlan', corporatePlanSchema);