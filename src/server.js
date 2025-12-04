// server.js
require('dotenv').config();

// ========== ✅ MANEJADORES DE ERRORES GLOBALES ==========
// Agrega esto AL INICIO
process.on('uncaughtException', (error) => {
    console.error('💥💥💥 ERROR NO CAPTURADO (uncaughtException):');
    console.error('   Mensaje:', error.message);
    console.error('   Stack:', error.stack);
    console.error('   Tipo:', error.name);
    console.error('   Fecha:', new Date().toISOString());
    
    // En producción, no salgas inmediatamente
    if (process.env.NODE_ENV === 'production') {
        console.error('🚨 En producción - Manteniendo proceso...');
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥💥💥 PROMESA RECHAZADA NO MANEJADA:');
    console.error('   Razón:', reason);
    console.error('   Fecha:', new Date().toISOString());
});

const http = require('http');
const connectDB = require('./config/database');
const app = require('./app');
const config = require('./config');

const PORT = config.PORT || process.env.PORT || 3000;

// ========== ✅ LOGS DE INICIO MEJORADOS ==========
console.log('🚀 === BACKEND APRENDE-FACIL ===');
console.log(`📅 ${new Date().toLocaleString()}`);
console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔢 Node.js: ${process.version}`);
console.log(`🎯 Puerto: ${PORT}`);
console.log(`🗄️  MongoDB URI: ${process.env.MONGODB_URI ? '✅ Definida' : '❌ No definida'}`);
console.log(`🔐 JWT Secret: ${config.JWT_SECRET ? '✅' : '❌'}`);
console.log('================================');

// ========== ✅ FUNCIÓN ASYNC PARA INICIAR TODO ==========
const startServer = async () => {
    try {
        console.log('\n🔗 Paso 1/2: Conectando a MongoDB Atlas...');
        
        // ✅ ESPERAR la conexión a MongoDB
        await connectDB();
        
        console.log('✅ MongoDB conectado exitosamente\n');
        
        // ✅ CREAR SERVIDOR HTTP
        const server = http.createServer(app);
        
        // ✅ AGREGAR RUTAS DE TEST DIRECTAMENTE (temporal para debugging)
        // Esto ayuda a identificar si el problema está en tus rutas
        app.get('/api/test-simple', (req, res) => {
            console.log('✅ Ruta /api/test-simple llamada');
            res.json({ 
                message: 'Servidor funcionando CORRECTAMENTE',
                timestamp: new Date().toISOString(),
                status: 'online',
                uptime: process.uptime(),
                memory: process.memoryUsage()
            });
        });
        
        app.get('/api/test-public', (req, res) => {
            console.log('✅ Ruta pública /api/test-public llamada');
            res.json({ 
                public: true,
                message: 'Ruta pública sin autenticación',
                timestamp: new Date().toISOString()
            });
        });
        
        // ✅ INICIAR SERVIDOR
        server.listen(PORT, () => {
            console.log('✅ Paso 2/2: Servidor HTTP iniciado');
            console.log(`📍 Local:    http://localhost:${PORT}`);
            console.log(`🌐 Railway:  https://backend-aprende-facil-production.up.railway.app`);
            console.log(`🗄️  MongoDB:  ✅ Conectado a Atlas`);
            console.log(`⏰ Hora:     ${new Date().toLocaleTimeString()}`);
            console.log(`📊 Uptime:   ${process.uptime()} segundos`);
            
            console.log('\n📋 Endpoints disponibles:');
            console.log('   GET  /health                → Estado del servicio');
            console.log('   GET  /api/test-simple       → Test simple (sin DB)');
            console.log('   GET  /api/test-public       → Test público (sin auth)');
            console.log('   POST /api/auth/register     → Registro de usuario');
            console.log('   POST /api/auth/login        → Inicio de sesión');
            console.log('   GET  /api/users/me          → Obtener usuario actual (protegido)');
            console.log('==========================================\n');
            
            console.log('⚠️  IMPORTANTE: Ruta GET /api/users NO existe en tu código');
            console.log('   Usa GET /api/users/me en su lugar\n');
        });
        
        // ✅ MANEJADOR DE ERRORES DEL SERVIDOR
        server.on('error', (err) => {
            console.error('\n💥 ERROR EN SERVIDOR HTTP:');
            console.error(`   Tipo: ${err.code}`);
            console.error(`   Mensaje: ${err.message}`);
            console.error(`   Stack: ${err.stack}`);
            
            if (process.env.NODE_ENV === 'production') {
                console.error('🚨 Railway: Saliendo en 10 segundos...');
                setTimeout(() => process.exit(1), 10000);
            }
        });
        
        // ✅ MONITOREAR ESTADO DEL SERVIDOR
        setInterval(() => {
            console.log(`🔄 Servidor activo - Uptime: ${process.uptime().toFixed(0)}s`);
        }, 60000); // Log cada minuto
        
        // ✅ MANEJAR SEÑALES DE CIERRE
        process.on('SIGTERM', () => {
            console.log('\n⚠️  SIGTERM recibido (Railway shutdown)');
            server.close(() => {
                console.log('✅ Servidor cerrado correctamente');
                process.exit(0);
            });
        });
        
        process.on('SIGINT', () => {
            console.log('\n⚠️  SIGINT recibido (Ctrl+C)');
            server.close(() => {
                console.log('✅ Servidor cerrado correctamente');
                process.exit(0);
            });
        });
        
    } catch (error) {
        // ✅ ERROR CRÍTICO
        console.error('\n💥❌ NO SE PUDO INICIAR EL SERVIDOR');
        console.error(`   Error: ${error.message}`);
        console.error(`   Tipo: ${error.name}`);
        console.error(`   Stack: ${error.stack}`);
        
        if (process.env.NODE_ENV === 'production') {
            console.error('🚨 Railway: Saliendo en 5 segundos...');
            setTimeout(() => process.exit(1), 5000);
        }
        
        throw error;
    }
};

// ========== ✅ MIDDLEWARE DE ERRORES PARA EXPRESS ==========
// Agrega esto AL FINAL de tu archivo app.js
// Si no tienes un archivo app.js, agrega esto antes de startServer()

const express = require('express');
if (app && typeof app.use === 'function') {
    // Middleware para rutas no encontradas
    app.use((req, res, next) => {
        console.error(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
        res.status(404).json({
            success: false,
            error: `Ruta ${req.method} ${req.originalUrl} no encontrada`
        });
    });

    // Middleware de errores general
    app.use((err, req, res, next) => {
        console.error('💥 ERROR EN RUTA:');
        console.error('   Ruta:', req.method, req.originalUrl);
        console.error('   Error:', err.message);
        console.error('   Stack:', err.stack);
        
        res.status(err.status || 500).json({
            success: false,
            error: process.env.NODE_ENV === 'production' 
                ? 'Error interno del servidor' 
                : err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    });
}

// ✅ INICIAR LA APLICACIÓN
startServer();