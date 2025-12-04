// server.js - VERSIÓN OPTIMIZADA PARA RAILWAY
require('dotenv').config();

// ========== ✅ CONFIGURACIÓN INICIAL ==========
console.log('='.repeat(60));
console.log('🚀 INICIANDO BACKEND EN RAILWAY');
console.log('='.repeat(60));
console.log(`📅 ${new Date().toLocaleString()}`);
console.log(`🔧 Node: ${process.version}`);
console.log(`🎯 Entorno: ${process.env.NODE_ENV || 'development'}`);

// ========== ✅ MANEJADORES DE ERRORES ==========
process.on('uncaughtException', (error) => {
    console.error('💥 ERROR NO CAPTURADO:', error.message);
    // Mantener proceso vivo
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 PROMESA RECHAZADA:', reason);
});

// ========== ✅ VERIFICAR DEPENDENCIAS CRÍTICAS ==========
const requiredModules = ['express', 'mongoose', 'cors', 'jsonwebtoken'];
requiredModules.forEach(moduleName => {
    try {
        require(moduleName);
        console.log(`✅ ${moduleName}: Disponible`);
    } catch (error) {
        console.error(`❌ ${moduleName}: NO DISPONIBLE - ${error.message}`);
        console.error('⚠️  Ejecuta: npm install express mongoose cors jsonwebtoken');
    }
});

// ========== ✅ CREAR APP EXPRESS ==========
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// ========== ✅ RUTAS BÁSICAS (sin DB primero) ==========
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: '✅ Backend funcionando en Railway',
        version: '1.0.0'
    });
});

// ========== ✅ CONEXIÓN MONGODB (con reintentos) ==========
const connectToDatabase = async () => {
    try {
        const mongoose = require('mongoose');
        
        // URI hardcodeada temporalmente
        const MONGODB_URI = process.env.MONGODB_URI || 
            'mongodb+srv://gilbertoramirez89461_db_user:Lcj9VPyvhJCejqly@aprendefacil.nggyhqs.mongodb.net/mi-proyecto-educativo?retryWrites=true&w=majority';
        
        console.log('🔗 Conectando a MongoDB...');
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB conectado exitosamente');
        
        // Agregar rutas que usan DB
        app.get('/api/db-status', async (req, res) => {
            try {
                const collections = await mongoose.connection.db.listCollections().toArray();
                res.json({
                    success: true,
                    database: mongoose.connection.db.databaseName,
                    collections: collections.map(c => c.name),
                    status: 'connected'
                });
            } catch (error) {
                res.json({
                    success: false,
                    error: error.message,
                    status: 'error'
                });
            }
        });
        
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        console.log('⚠️  Continuando sin base de datos...');
        return false;
    }
};

// ========== ✅ INICIAR SERVIDOR ==========
const startServer = async () => {
    try {
        // Puerto de Railway
        const PORT = process.env.PORT || 8080;
        
        console.log(`🎯 Puerto asignado: ${PORT}`);
        
        // Intentar conectar a DB
        const dbConnected = await connectToDatabase();
        
        // Si hay DB, agregar más rutas
        if (dbConnected) {
            try {
                const userRoutes = require('./modules/users/user.route');
                const authRoutes = require('./modules/auth/auth.route');
                
                app.use('/api/users', userRoutes);
                app.use('/api/auth', authRoutes);
                
                console.log('✅ Rutas de usuarios y autenticación cargadas');
            } catch (routeError) {
                console.error('⚠️  Error cargando rutas:', routeError.message);
            }
        }
        
        // Ruta 404
        app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: `Ruta ${req.method} ${req.url} no encontrada`,
                availableRoutes: ['/health', '/api/test', '/api/db-status']
            });
        });
        
        // Middleware de errores
        app.use((err, req, res, next) => {
            console.error('💥 Error en aplicación:', err.message);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        });
        
        // Crear servidor
        const http = require('http');
        const server = http.createServer(app);
        
        // Escuchar
        server.listen(PORT, '0.0.0.0', () => {
            console.log('='.repeat(60));
            console.log('✅ SERVIDOR INICIADO EXITOSAMENTE');
            console.log('='.repeat(60));
            console.log(`📍 URL: https://backend-aprende-facil-production.up.railway.app`);
            console.log(`🔗 Local: http://localhost:${PORT}`);
            console.log(`🕐 Uptime: ${process.uptime()}s`);
            console.log('');
            console.log('📋 ENDPOINTS:');
            console.log('   GET /health');
            console.log('   GET /api/test');
            console.log('   GET /api/db-status');
            if (dbConnected) {
                console.log('   POST /api/auth/register');
                console.log('   POST /api/auth/login');
                console.log('   GET /api/users/me');
            }
            console.log('='.repeat(60));
        });
        
        // Manejar errores del servidor
        server.on('error', (error) => {
            console.error('💥 Error del servidor:', error.message);
        });
        
        // Keep-alive log
        setInterval(() => {
            console.log(`🔄 Activo por ${Math.floor(process.uptime())} segundos`);
        }, 60000);
        
    } catch (error) {
        console.error('💥 Error crítico al iniciar:', error.message);
        console.error('Stack:', error.stack);
    }
};

// ========== ✅ MANEJAR SEÑALES ==========
['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => {
        console.log(`\n⚠️  ${signal} recibido - Cerrando...`);
        process.exit(0);
    });
});

// ========== ✅ INICIAR ==========
startServer();