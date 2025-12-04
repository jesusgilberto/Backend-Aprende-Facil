const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
    try {
        console.log('🔗 Conectando a MongoDB Atlas...');
        const uri = config.MONGODB_URI;
        if (!uri) {
            throw new Error('❌ MONGODB_URI no definida en variables de entorno');
        }
        const safeUri = uri.replace(/:\/\/(.+?):(.+?)@/, '://<user>:<pass>@');
        console.log(`   URL: ${safeUri.substring(0, 80)}...`);

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
        });

        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('❌ Error MongoDB:', error.message);
        if (config.NODE_ENV === 'production') {
            console.error('🚨 Error crítico en producción: deteniendo aplicación.');
            throw error;
        }
        console.log('⚠️  Continuando sin base de datos en desarrollo...');
    }
};

module.exports = connectDB;