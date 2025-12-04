const mongoose = require('mongoose');
const { MONGODB_URI } = require('./index');


const connectDB = async () => {
    try {
        console.log('🔗 Conectando a MongoDB Atlas...');
        
        if (!MONGODB_URI) {
            throw new Error('❌ MONGODB_URI no definida');
        }
        
        console.log(`   URL: ${MONGODB_URI.substring(0, 60)}...`);
        
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
        });
        
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
        return conn;
        
    } catch (error) {
        console.error('❌ Error MongoDB:', error.message);
        throw error;  // Propaga el error
    }
};

// ✅ EXPORTAR LA FUNCIÓN DIRECTAMENTE
module.exports = connectDB;