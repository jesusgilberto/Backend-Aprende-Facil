// server.js
require('dotenv').config();

const http = require('http');
const connectDB = require('./config/database');
const app = require('./app');
const config = require('./config');

const PORT = config.PORT || process.env.PORT || 3000;

// ✅ LOGS DE INICIO MEJORADOS
console.log('🚀 === BACKEND APRENDE-FACIL ===');
console.log(`📅 ${new Date().toLocaleString()}`);
console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔢 Node.js: ${process.version}`);
console.log(`🎯 Puerto: ${PORT}`);
console.log('================================');

// ✅ FUNCIÓN ASYNC PARA INICIAR TODO
const startServer = async () => {
    try {
        console.log('\n🔗 Paso 1/2: Conectando a MongoDB Atlas...');
        
        // ✅ ESPERAR la conexión a MongoDB
        await connectDB();
        
        console.log('✅ MongoDB conectado exitosamente\n');
        
        // ✅ CREAR SERVIDOR HTTP
        const server = http.createServer(app);
        
        // ✅ INICIAR SERVIDOR
        server.listen(PORT, () => {
            console.log('✅ Paso 2/2: Servidor HTTP iniciado');
            console.log(`📍 Local:    http://localhost:${PORT}`);
            console.log(`🌐 Railway:  https://backend-aprende-facil-production.up.railway.app`);
            console.log(`🗄️  MongoDB:  ✅ Conectado a Atlas`);
            console.log(`⏰ Hora:     ${new Date().toLocaleTimeString()}`);
            console.log('\n📋 Endpoints disponibles:');
            console.log('   GET  /health               → Estado del servicio');
            console.log('   POST /api/auth/register    → Registro de usuario');
            console.log('   POST /api/auth/login       → Inicio de sesión');
            console.log('   GET  /api/users            → Listar usuarios (protegido)');
            console.log('==========================================\n');
        });
        
        // ✅ MANEJADOR DE ERRORES MEJORADO
        server.on('error', (err) => {
            console.error('\n💥 ERROR EN SERVIDOR HTTP:');
            console.error(`   Tipo: ${err.code}`);
            console.error(`   Mensaje: ${err.message}`);
            
            if (err.code === 'EADDRINUSE') {
                console.error(`\n⚠️  Puerto ${PORT} ocupado. Soluciones:`);
                console.error('   1. Railway asigna puertos automáticos - usa process.env.PORT');
                console.error('   2. Espera 60 segundos');
                console.error('   3. Si es local: `npx kill-port ${PORT}`');
            }
            
            // En Railway, sale con error
            if (process.env.NODE_ENV === 'production') {
                console.error('🚨 Railway: Saliendo...');
                setTimeout(() => process.exit(1), 1000);
            }
        });
        
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
        // ✅ ERROR CRÍTICO - No se pudo conectar a MongoDB
        console.error('\n💥❌ NO SE PUDO INICIAR EL SERVIDOR');
        console.error(`   Error: ${error.message}`);
        console.error(`   Tipo: ${error.name}`);
        
        if (error.message.includes('MongoDB') || error.message.includes('connect')) {
            console.error('\n🔍 PROBLEMA DE CONEXIÓN MONGODB:');
            console.error('   1. Verifica MONGODB_URI en Railway Variables');
            console.error('   2. Revisa IP Whitelist en MongoDB Atlas');
            console.error('   3. Verifica usuario/contraseña en Atlas');
        }
        
        // En Railway/PRODUCCIÓN, sale con error
        if (process.env.NODE_ENV === 'production') {
            console.error('🚨 Railway: Aplicación falló - Saliendo...');
            setTimeout(() => process.exit(1), 2000);
        } else {
            console.error('⚠️  Desarrollo: Manteniendo proceso para debug...');
        }
        
        throw error;
    }
};

// ✅ INICIAR LA APLICACIÓN
startServer();