const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔗 Conectando a MongoDB Atlas...');
        
        // ✅ FORZAR la URI CORRECTA - IGNORAR process.env
        const PRODUCTION_URI = 'mongodb+srv://gilbertoramirez89461_db_user:Lcj9VPyvhJCejqly@aprendefacil.nggyhqs.mongodb.net/v';
        const uri = PRODUCTION_URI;
        
        console.log(`🔧 URI FORZADA: ${uri.substring(0, 80)}...`);

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
        });

        console.log(`🎉 MongoDB Conectado EXITOSAMENTE: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('💥 Error MongoDB:', error.message);
        console.error('🔧 URI intentada:', uri);
        throw error;
    }
};

module.exports = connectDB;