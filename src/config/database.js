const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/mi-proyecto-educativo',
        );
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        // No usar process.exit() en desarrollo
        console.log('⚠️  Continuando sin base de datos...');
    }
};

module.exports = connectDB;
