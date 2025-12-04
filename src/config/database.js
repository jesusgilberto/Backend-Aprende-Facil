const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        console.log('🔗 Conectando a MongoDB Atlas...');
        
        // ✅ USA process.env DIRECTAMENTE:
        const MONGODB_URI = process.env.MONGODB_URI;
        
        if (!MONGODB_URI) {
            throw new Error('❌ MONGODB_URI no definida en variables de entorno');
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
        throw error;
    }
};

module.exports = connectDB;