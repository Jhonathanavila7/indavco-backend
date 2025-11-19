require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://dulcet-bienenstitch-fd15a1.netlify.app',  // Frontend principal
  'https://effulgent-empanada-af5673.netlify.app',   // Admin panel
];

const app = express();

// Conectar a la base de datos
connectDB();

// Configuración CORS
app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🗑️ HE BORRADO LA LÍNEA app.options('*', cors()) PORQUE CAUSABA EL ERROR
// El app.use(cors(...)) de arriba ya maneja las opciones automáticamente.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ API de Indavco Systems funcionando correctamente',
    version: '1.0.0'
  });
});

// Rutas de la API
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/blog', require('./src/routes/blogRoutes'));
app.use('/api/projects', require('./src/routes/projectRoutes'));
app.use('/api/corporate-plans', require('./src/routes/corporatePlanRoutes'));
app.use('/api/clients', require('./src/routes/clientRoutes'));

// ============= RUTAS TEMPORALES PARA SETUP =============
app.get('/api/create-admin-now', async (req, res) => {
  try {
    const User = require('./src/models/User');
    await User.deleteOne({ email: 'admin@indavco.com' });
    
    const admin = new User({
      name: 'Administrador',
      email: 'admin@indavco.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    
    await admin.save();
    
    res.json({ 
      success: true, 
      message: 'Admin creado exitosamente con bcryptjs',
      admin: { email: admin.email, role: admin.role, isActive: admin.isActive } 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message, details: 'Error creando admin' });
  }
});

app.get('/api/check-admin', async (req, res) => {
  try {
    const User = require('./src/models/User');
    const admin = await User.findOne({ email: 'admin@indavco.com' });
    const totalUsers = await User.countDocuments();
    
    res.json({
      adminExists: !!admin,
      adminDetails: admin ? { email: admin.email, role: admin.role, isActive: admin.isActive, name: admin.name } : null,
      totalUsers: totalUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/test-login', async (req, res) => {
  try {
    const User = require('./src/models/User');
    const bcrypt = require('bcryptjs');
    const user = await User.findOne({ email: 'admin@indavco.com' }).select('+password');
    
    if (!user) return res.json({ error: 'Usuario no encontrado' });
    
    const isValid = await bcrypt.compare('admin123', user.password);
    
    res.json({
      userFound: true,
      email: user.email,
      passwordValid: isValid,
      message: isValid ? 'Password correcto' : 'Password incorrecto'
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});
// ============= FIN DE RUTAS TEMPORALES =============

// Manejo de errores
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS habilitado para:`, allowedOrigins);
});

module.exports = app;
