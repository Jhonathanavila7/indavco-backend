require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',                          // Para que te funcione en tu PC
    'http://localhost:3000',                          // Por si acaso usas este puerto
    'https://dulcet-bienenstitch-fd15a1.netlify.app' // 👈 TU APP EN NETLIFY (Copiado de tu error)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV}`);
});
