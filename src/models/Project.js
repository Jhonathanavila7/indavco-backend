const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida']
  },
  featuredImage: {
  type: String,
  default: ''
},
images: {
  type: [String],
  default: []
},
  client: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Desarrollo Web', 'Aplicación Móvil', 'Software Empresarial', 'Cloud', 'IA/ML', 'Consultoría'],
    required: true
  },
  technologies: [{
    type: String
  }],
  images: [{
    type: String
  }],
  projectUrl: {
    type: String
  },
  duration: {
    type: String
  },
  completedDate: {
    type: Date
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  testimonial: {
    text: String,
    author: String,
    position: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);