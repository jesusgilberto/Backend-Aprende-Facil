// server.js - VERSIÓN CON MONITOREO MEJORADO
require('dotenv').config();

// ========== ✅ MANEJADORES DE ERRORES GLOBALES ==========
process.on('uncaughtException', (error) => {
    console.error('💥💥💥 ERROR NO CAPTURADO (uncaughtException):');
    console.error('   Mensaje:', error.message);
    console.error('   Stack:', error.stack);
    console.error('   Tipo:', error.name);
    console.error('   Fecha:', new Date().toISOString());
    // Mantener proceso vivo para monitoreo
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
console.log('='.repeat(50));

// ========== ✅ VARIABLES DE MONITOREO ==========
let serverStartTime = Date.now();
let requestCount = 0;
let healthCheckCount = 0;

// ========== ✅ MIDDLEWARE DE MONITOREO ==========
// Agrega esto a tu app.js o aquí si no tienes app.js
app.use((req, res, next) => {
    requestCount++;
    
    // Log de peticiones importantes
    if (req.url === '/health' || req.url.includes('/api/')) {
        console.log(`📨 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    }
    
    // Contador para health checks
    if (req.url === '/health') {
        healthCheckCount++;
    }
    
    next();
});

// ========== ✅ RUTA DE HEALTH MEJORADA ==========
app.get('/health', (req, res) => {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    
    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime)}s`,
        memory: {
            rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
            heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`
        },
        requests: {
            total: requestCount,
            healthChecks: healthCheckCount
        },
        server: {
            startTime: new Date(serverStartTime).toISOString(),
            uptimeDays: (uptime / 86400).toFixed(2)
        },
        database: 'checking...',
        environment: process.env.NODE_ENV || 'development'
    };
    
    // Verificar conexión a MongoDB
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
        healthData.database = 'connected';
        healthData.dbStats = {
            name: mongoose.connection.db.databaseName,
            collections: 'available'
        };
    } else {
        healthData.database = 'disconnected';
    }
    
    res.json(healthData);
});

// ========== ✅ RUTA DE STATUS COMPLETO ==========
app.get('/api/status', (req, res) => {
    const status = {
        server: {
            status: 'online',
            uptime: process.uptime(),
            startTime: new Date(serverStartTime).toLocaleString(),
            nodeVersion: process.version,
            platform: process.platform
        },
        requests: {
            total: requestCount,
            healthChecks: healthCheckCount,
            ratePerMinute: requestCount / (process.uptime() / 60)
        },
        memory: process.memoryUsage(),
        database: {
            connected: false,
            readyState: 0
        },
        endpoints: [
            'GET /health',
            'GET /api/status',
            'GET /api/test-simple',
            'GET /api/test-public',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/users/me (protegido)'
        ]
    };
    
    // Verificar MongoDB
    try {
        const mongoose = require('mongoose');
        status.database.readyState = mongoose.connection.readyState;
        status.database.connected = mongoose.connection.readyState === 1;
        if (status.database.connected) {
            status.database.name = mongoose.connection.db.databaseName;
        }
    } catch (error) {
        status.database.error = error.message;
    }
    
    res.json(status);
});

// ========== ✅ RUTAS DE TEST ==========
app.get('/api/test-simple', (req, res) => {
    console.log('✅ Ruta /api/test-simple llamada');
    res.json({ 
        message: 'Servidor funcionando CORRECTAMENTE',
        timestamp: new Date().toISOString(),
        status: 'online',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

app.get('/api/test-public', (req, res) => {
    console.log('✅ Ruta pública /api/test-public llamada');
    res.json({ 
        public: true,
        message: 'Ruta pública sin autenticación',
        timestamp: new Date().toISOString(),
        note: 'Para rutas protegidas, usa /api/users/me con token JWT'
    });
});

// ========== ✅ FUNCIÓN PARA INICIAR TODO ==========
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
            serverStartTime = Date.now();
            
            console.log('✅ Paso 2/2: Servidor HTTP iniciado');
            console.log(`📍 Local:    http://localhost:${PORT}`);
            console.log(`🌐 Railway:  https://backend-aprende-facil-production.up.railway.app`);
            console.log(`🗄️  MongoDB:  ✅ Conectado a Atlas`);
            console.log(`⏰ Inicio:   ${new Date().toLocaleTimeString()}`);
            console.log(`📊 PID:      ${process.pid}`);
            
            console.log('\n📋 Endpoints principales:');
            console.log('   GET  /health                → Estado de salud detallado');
            console.log('   GET  /api/status           → Status completo del sistema');
            console.log('   GET  /api/test-simple      → Test simple');
            console.log('   GET  /api/test-public      → Test público');
            console.log('   POST /api/auth/register    → Registro de usuario');
            console.log('   POST /api/auth/login       → Inicio de sesión');
            console.log('   GET  /api/users/me         → Usuario actual (protegido)');
            console.log('='.repeat(50));
            console.log('ℹ️  Monitoreo activo - Revisa /health para estadísticas');
            console.log('='.repeat(50));
        });
        
        // ✅ SISTEMA DE MONITOREO AUTOMÁTICO
        let lastRequestCount = 0;
        
        setInterval(() => {
            const uptime = process.uptime();
            const minutes = Math.floor(uptime / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            const requestsSinceLastCheck = requestCount - lastRequestCount;
            lastRequestCount = requestCount;
            
            console.log(`📊 [MONITOR] Uptime: ${days}d ${hours % 24}h ${minutes % 60}m`);
            console.log(`📊 [MONITOR] Requests totales: ${requestCount}`);
            console.log(`📊 [MONITOR] Requests/min: ${requestsSinceLastCheck}`);
            console.log(`📊 [MONITOR] Health checks: ${healthCheckCount}`);
            
            // Verificar memoria
            const memory = process.memoryUsage();
            const heapUsedMB = Math.round(memory.heapUsed / 1024 / 1024);
            if (heapUsedMB > 500) {
                console.warn(`⚠️  [MONITOR] Alto uso de memoria: ${heapUsedMB}MB`);
            }
            
        }, 60000); // Cada minuto
        
        // ✅ MONITOR DE CONEXIÓN MONGODB
        setInterval(() => {
            const mongoose = require('mongoose');
            const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
            console.log(`🗄️  [DB STATUS] MongoDB: ${states[mongoose.connection.readyState]}`);
        }, 30000); // Cada 30 segundos
        
        // ✅ MANEJADOR DE ERRORES DEL SERVIDOR
        server.on('error', (err) => {
            console.error('\n💥 ERROR EN SERVIDOR HTTP:');
            console.error(`   Tipo: ${err.code}`);
            console.error(`   Mensaje: ${err.message}`);
            
            // Railway maneja el reinicio automático
            console.error('🔄 Railway reiniciará el servicio automáticamente');
        });
        
        // ✅ MANEJAR SEÑALES DE CIERRE
        const gracefulShutdown = () => {
            console.log('\n⚠️  Iniciando apagado graceful...');
            server.close(() => {
                console.log('✅ Servidor cerrado correctamente');
                console.log(`📊 Requests totales atendidos: ${requestCount}`);
                console.log(`📊 Uptime final: ${process.uptime().toFixed(0)} segundos`);
                process.exit(0);
            });
            
            // Timeout forzar cierre después de 10 segundos
            setTimeout(() => {
                console.error('⏰ Timeout - Forzando cierre...');
                process.exit(1);
            }, 10000);
        };
        
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
        
    } catch (error) {
        // ✅ ERROR CRÍTICO
        console.error('\n💥❌ NO SE PUDO INICIAR EL SERVIDOR');
        console.error(`   Error: ${error.message}`);
        console.error(`   Tipo: ${error.name}`);
        
        if (error.message.includes('MongoDB') || error.message.includes('connect')) {
            console.error('\n🔍 PROBLEMA DE CONEXIÓN MONGODB:');
            console.error('   1. Verifica MONGODB_URI en Railway Variables');
            console.error('   2. Revisa IP Whitelist en MongoDB Atlas');
            console.error('   3. Verifica usuario/contraseña en Atlas');
        }
        
        // En Railway, sale con error para reinicio automático
        if (process.env.NODE_ENV === 'production') {
            console.error('🚨 Railway: Aplicación falló - Reiniciando...');
            setTimeout(() => process.exit(1), 5000);
        }
        
        throw error;
    }
};

// ========== ✅ INICIAR LA APLICACIÓN ==========
startServer();

// ========== ✅ EXPORT PARA TESTING ==========
module.exports = { app, startServer };