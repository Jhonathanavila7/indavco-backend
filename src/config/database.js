const mongoose = require('mongoose'); // Asegúrate de que sea 'const', no 'onst'

const connectDB = async () => {
  try {
    // Intenta conectar usando la variable de entorno
    // (Asegúrate de tener MONGO_URI en tus variables de Render)
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('🌱 MongoDB conectado exitosamente');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    // Salir del proceso si falla la conexión para que Render intente reiniciar
    process.exit(1);
  }
};

// 👇 ESTA ES LA LÍNEA QUE TE FALTA O ESTÁ MAL
module.exports = connectDB;
