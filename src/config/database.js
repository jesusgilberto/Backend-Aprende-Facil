const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🚨🚨🚨 DEBUG COMPLETO DE VARIABLES 🚨🚨🚨');
        console.log('🔧 process.env.MONGODB_URI:', JSON.stringify(process.env.MONGODB_URI));
        console.log('🔧 process.env.NODE_ENV:', process.env.NODE_ENV);
        console.log('🔧 Todas las variables MONGODB relacionadas:');
        
        // Busca TODAS las variables que puedan contener MONGODB
        Object.keys(process.env).forEach(key => {
            if (key.includes('MONGODB') || key.includes('MONGO') || key.includes('DB')) {
                console.log(`   ${key}: ${process.env[key]?.substring(0, 50)}...`);
            }
        });
        
        console.log('🔧 Todas las variables disponibles:', Object.keys(process.env));
        
        const uri = process.env.MONGODB_URI;
        
        if (!uri) {
            console.error('❌ ERROR CRÍTICO: process.env.MONGODB_URI es:', uri);
            throw new Error('MONGODB_URI no definida');
        }
        
        console.log(`🔧 URI COMPLETA (sin ocultar): ${uri}`);
        
        // Solo oculta para el log final
        const safeUri = uri.replace(/:\/\/(.+?):(.+?)@/, '://<user>:<pass>@');
        console.log(`✅ URI MongoDB: ${safeUri.substring(0, 80)}...`);

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
        });

        console.log(`🎉🎉🎉 MongoDB Conectado EXITOSAMENTE: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('💥💥💥 ERROR FATAL MongoDB:', error.message);
        console.error('🔧 URI que intentó usar:', process.env.MONGODB_URI);
        console.error('🔧 Tipo de error:', error.name);
        
        throw error;
    }
};

module.exports = connectDB;