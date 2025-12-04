// server.js
require('dotenv').config();

// ========== ✅ MANEJADORES DE ERRORES GLOBALES ==========
process.on('uncaughtException', (error) => {
    console.error('💥💥💥 ERROR NO CAPTURADO (uncaughtException):');
    console.error('   Mensaje:', error.message);
    console.error('   Stack:', error.stack);
    console.error('   Fecha:', new Date().toISOString());
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

const PORT = config.PORT || process.env.PORT || 8080;

// ========== ✅ LOGS DE INICIO ==========
console.log('\n' + '='.repeat(50));
console.log('🚀 BACKEND APRENDE-FACIL - INICIANDO');
console.log('='.repeat(50));
console.log(`📅 ${new Date().toLocaleString()}`);
console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔢 Node.js: ${process.version}`);
console.log(`🎯 Puerto: ${PORT}`);
console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? '✅ URI definida' : '❌ No definida'}`);
console.log(`🔐 JWT: ${config.JWT_SECRET ? '✅ Configurado' : '❌ Faltante'}`);

// ========== ✅ FUNCIÓN PARA INICIAR SERVIDOR ==========
const startServer = async () => {
    try {
        console.log('\n🔗 Conectando a MongoDB Atlas...');
        
        // Conectar a MongoDB
        await connectDB();
        
        console.log('✅ MongoDB conectado exitosamente\n');
        
        // Crear servidor HTTP
        const server = http.createServer(app);
        
        // Iniciar servidor
        server.listen(PORT, () => {
            console.log('✅ Servidor HTTP iniciado');
            console.log(`📍 Local:    http://localhost:${PORT}`);
            console.log(`🌐 Railway:  https://backend-aprende-facil-production.up.railway.app`);
            console.log(`⏰ Hora:     ${new Date().toLocaleTimeString()}`);
            console.log(`📊 Uptime:   ${process.uptime()} segundos`);
            
            console.log('\n📋 Endpoints disponibles:');
            console.log('   GET  /health                    → Estado general');
            console.log('   GET  /api/health               → Estado API');
            console.log('   GET  /api/test-simple          → Test simple');
            console.log('   GET  /api/test-public          → Test público');
            console.log('   POST /api/auth/register        → Registro');
            console.log('   POST /api/auth/login           → Login');
            console.log('   GET  /api/users/me             → Usuario actual (con token)');
            console.log('='.repeat(50));
            console.log('⚠️  IMPORTANTE:');
            console.log('   - GET /api/users NO EXISTE en tu código');
            console.log('   - Usa GET /api/users/me con token JWT');
            console.log('='.repeat(50) + '\n');
        });
        
        // Manejar errores del servidor
        server.on('error', (err) => {
            console.error('\n💥 ERROR EN SERVIDOR HTTP:');
            console.error(`   Tipo: ${err.code}`);
            console.error(`   Mensaje: ${err.message}`);
            
            if (err.code === 'EADDRINUSE') {
                console.error(`\n⚠️  Puerto ${PORT} ocupado`);
            }
        });
        
        // Manejar señales de cierre
        ['SIGTERM', 'SIGINT'].forEach(signal => {
            process.on(signal, () => {
                console.log(`\n⚠️  ${signal} recibido`);
                server.close(() => {
                    console.log('✅ Servidor cerrado correctamente');
                    process.exit(0);
                });
            });
        });
        
    } catch (error) {
        console.error('\n💥❌ NO SE PUDO INICIAR EL SERVIDOR');
        console.error(`   Error: ${error.message}`);
        
        if (error.message.includes('MongoDB') || error.message.includes('connect')) {
            console.error('\n🔍 PROBLEMA DE CONEXIÓN MONGODB:');
            console.error('   1. Verifica MONGODB_URI en Railway');
            console.error('   2. Revisa IP Whitelist en Atlas');
        }
        
        process.exit(1);
    }
};

// Iniciar servidor
startServer();