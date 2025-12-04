const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔗 Conectando a MongoDB Atlas...');
        
        // ✅ USA process.env DIRECTAMENTE
        const uri = process.env.MONGODB_URI;
        
        if (!uri) {
            console.error('❌ ERROR: MONGODB_URI no definida en Railway Variables');
            console.error('🔧 Variables disponibles:', Object.keys(process.env));
            throw new Error('MONGODB_URI no definida');
        }
        
        // Muestra la URI (oculta contraseña)
        const safeUri = uri.replace(/:\/\/(.+?):(.+?)@/, '://<user>:<pass>@');
        console.log(`✅ URI MongoDB: ${safeUri.substring(0, 80)}...`);
        console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
        });

        console.log(`🎉 MongoDB Conectado: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('💥 Error MongoDB:', error.message);
        console.error('🔧 URI usada:', process.env.MONGODB_URI);
        
        if (process.env.NODE_ENV === 'production') {
            console.error('🚨 Error crítico en producción: deteniendo aplicación.');
            throw error;
        }
        console.log('⚠️  Continuando sin base de datos en desarrollo...');
    }
};

module.exports = connectDB;