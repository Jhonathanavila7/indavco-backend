require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://dulcet-bienenstitch-fd15a1.netlify.app',
  'https://effulgent-empanada-af5673.netlify.app',
];

const app = express();

// Conectar a la base de datos
connectDB();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

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

// ⬇️⬇️⬇️ AGREGAR AQUÍ LAS RUTAS TEMPORALES ⬇️⬇️⬇️

// Ruta temporal para crear admin inicial
app.post('/api/setup-admin', async (req, res) => {
  try {
    const User = require('./src/models/User');
    
    // Verificar si ya existe algún usuario admin
    const adminExists = await User.findOne({ email: 'admin@indavco.com' });
    
    if (adminExists) {
      return res.json({ 
        message: 'El usuario admin ya existe',
        hint: 'Intenta hacer login con admin@indavco.com'
      });
    }
    
    // Crear el usuario admin
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@indavco.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    
    res.json({ 
      success: true,
      message: 'Usuario admin creado exitosamente',
      credentials: {
        email: 'admin@indavco.com',
        password: 'admin123'
      }
    });
    
  } catch (error) {
    console.error('Error creando admin:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Verifica la conexión a MongoDB'
    });
  }
});

// Ruta para verificar usuarios
app.get('/api/check-users', async (req, res) => {
  try {
    const User = require('./src/models/User');
    const count = await User.countDocuments();
    const users = await User.find().select('email role isActive');
    
    res.json({
      totalUsers: count,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ⬆️⬆️⬆️ FIN DE RUTAS TEMPORALES ⬆️⬆️⬆️

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV}`);
});
