const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    // ✅ CORREGIDO - Agregados los paréntesis
    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
  } catch (error) {
    // ✅ CORREGIDO - Agregados los paréntesis
    console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
