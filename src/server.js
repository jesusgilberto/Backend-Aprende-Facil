// server.js - VERSIÓN LIMPIA
require('dotenv').config();

// ========== ✅ MANEJADORES DE ERRORES GLOBALES ==========
process.on('uncaughtException', (error) => {
    console.error('💥 ERROR NO CAPTURADO (uncaughtException):');
    console.error('   Mensaje:', error.message);
    console.error('   Stack:', error.stack);
    console.error('   Tipo:', error.name);
    console.error('   Fecha:', new Date().toISOString());
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 PROMESA RECHAZADA NO MANEJADA:');
    console.error('   Razón:', reason);
    console.error('   Fecha:', new Date().toISOString());
});

const http = require('http');
const connectDB = require('./config/database');
const app = require('./app');
const config = require('./config');

const PORT = config.PORT || process.env.PORT || 3000;

// ========== ✅ VARIABLES DE MONITOREO ==========
let serverStartTime = Date.now();
let requestCount = 0;
let healthCheckCount = 0;

// ========== ✅ MIDDLEWARE DE MONITOREO ==========
app.use((req, res, next) => {
    requestCount++;
    
    // Contador para health checks
    if (req.url === '/health') {
        healthCheckCount++;
    }
    
    next();
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
    res.json({ 
        message: 'Servidor funcionando CORRECTAMENTE',
        timestamp: new Date().toISOString(),
        status: 'online',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

app.get('/api/test-public', (req, res) => {
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
        // ✅ ESPERAR la conexión a MongoDB
        await connectDB();
        
        // ✅ CREAR SERVIDOR HTTP
        const server = http.createServer(app);
        
        // ✅ INICIAR SERVIDOR
        server.listen(PORT, () => {
            serverStartTime = Date.now();
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
            
            // Verificar memoria
            const memory = process.memoryUsage();
            const heapUsedMB = Math.round(memory.heapUsed / 1024 / 1024);
            if (heapUsedMB > 500) {
                console.warn(`⚠️ Alto uso de memoria: ${heapUsedMB}MB`);
            }
            
        }, 60000); // Cada minuto
        
        // ✅ MANEJADOR DE ERRORES DEL SERVIDOR
        server.on('error', (err) => {
            console.error('💥 ERROR EN SERVIDOR HTTP:');
            console.error(`   Tipo: ${err.code}`);
            console.error(`   Mensaje: ${err.message}`);
        });
        
        // ✅ MANEJAR SEÑALES DE CIERRE
        const gracefulShutdown = () => {
            server.close(() => {
                process.exit(0);
            });
            
            // Timeout forzar cierre después de 10 segundos
            setTimeout(() => {
                process.exit(1);
            }, 10000);
        };
        
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
        
    } catch (error) {
        // ✅ ERROR CRÍTICO
        console.error('💥 NO SE PUDO INICIAR EL SERVIDOR');
        console.error(`   Error: ${error.message}`);
        console.error(`   Tipo: ${error.name}`);
        
        if (error.message.includes('MongoDB') || error.message.includes('connect')) {
            console.error('🔍 PROBLEMA DE CONEXIÓN MONGODB');
        }
        
        // En Railway, sale con error para reinicio automático
        if (process.env.NODE_ENV === 'production') {
            setTimeout(() => process.exit(1), 5000);
        }
        
        throw error;
    }
};

// ========== ✅ INICIAR LA APLICACIÓN ==========
startServer();

// ========== ✅ EXPORT PARA TESTING ==========
module.exports = { app, startServer };