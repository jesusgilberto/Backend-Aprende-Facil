// REEMPLAZA solo la función connectToDatabase con esto:

const connectToDatabase = async () => {
    try {
        const mongoose = require('mongoose');
        
        // ✅ URI CORRECTA DE ATLAS (usa la tuya exacta)
        const MONGODB_URI = 'mongodb+srv://gilbertoramirez89461_db_user:Lcj9VPyvhJCejqly@aprendefacil.nggyhqs.mongodb.net/mi-proyecto-educativo?retryWrites=true&w=majority';
        
        console.log('🔗 Conectando a MongoDB Atlas...');
        console.log('URI:', MONGODB_URI.substring(0, 50) + '...');
        
        // ✅ CONEXIÓN DIRECTA, sin opciones por defecto
        await mongoose.connect(MONGODB_URI);
        
        console.log('✅ MongoDB Atlas conectado exitosamente');
        console.log(`📊 Base de datos: ${mongoose.connection.db.databaseName}`);
        
        // ✅ AGREGAR RUTAS QUE USAN DB
        app.get('/api/users/count', async (req, res) => {
            try {
                const User = require('./modules/users/user.model');
                const count = await User.countDocuments();
                res.json({
                    success: true,
                    count: count,
                    message: `Hay ${count} usuarios en la base de datos`
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        
        // Cargar rutas de usuarios y auth
        try {
            const userRoutes = require('./modules/users/user.route');
            const authRoutes = require('./modules/auth/auth.route');
            
            app.use('/api/users', userRoutes);
            app.use('/api/auth', authRoutes);
            
            console.log('✅ Rutas de usuarios y autenticación cargadas');
        } catch (routeError) {
            console.error('⚠️  Error cargando rutas:', routeError.message);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB Atlas:', error.message);
        console.error('🔍 Detalles:', error);
        return false;
    }
};