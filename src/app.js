const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ========== ✅ MIDDLEWARE BÁSICO ==========
app.use(cors());
app.use(express.json());

// ========== ✅ LOGGING DE PETICIONES (útil para debugging) ==========
app.use((req, res, next) => {
    const reqId = req.headers['x-railway-request-id'] || req.headers['x-request-id'] || 'no-id';
    const ip = req.headers['x-forwarded-for'] || req.ip || req.socket?.remoteAddress;
    console.log(`📨 ${new Date().toISOString()} [${reqId}] ${req.method} ${req.originalUrl} ← ${ip}`);
    if (Object.keys(req.body).length > 0) {
        console.log('   Body:', JSON.stringify(req.body).substring(0, 200) + '...');
    }
    next();
});

// ========== ✅ RUTAS ==========
const authRoutes = require('./modules/auth/auth.route');
const userRoutes = require('./modules/users/user.route');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ========== ✅ RUTAS DE SALUD Y TEST ==========
// Raíz simple para verificar enrutamiento del proxy
app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'Backend Aprende-Fácil activo',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: '✅ Backend funcionando correctamente!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '✅ API funcionando correctamente!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// ✅ RUTAS DE TEST PARA DEBUGGING (añadidas temporalmente)
app.get('/api/test-simple', (req, res) => {
    console.log('✅ Ruta /api/test-simple llamada');
    res.json({ 
        success: true,
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
        success: true,
        public: true,
        message: 'Ruta pública sin autenticación',
        timestamp: new Date().toISOString()
    });
});

// ========== ✅ RUTA 404 MEJORADA ==========
app.use((req, res) => {
    console.error(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    
    res.status(404).json({ 
        success: false, 
        message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
        availableRoutes: [
            'GET /health',
            'GET /api/health',
            'GET /api/test-simple',
            'GET /api/test-public',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/users/me (requiere token)',
            '❌ NOTA: GET /api/users no existe, usa GET /api/users/me'
        ]
    });
});

// ========== ✅ ERROR HANDLER MEJORADO ==========
// Reemplaza tu errorHandler actual con este middleware directo
// o modifica tu archivo errorHandler.js

app.use((err, req, res, next) => {
    console.error('💥💥💥 ERROR NO MANEJADO EN APP.JS:');
    console.error('   Ruta:', req.method, req.originalUrl);
    console.error('   Mensaje:', err.message);
    console.error('   Stack:', err.stack);
    console.error('   Tipo:', err.name);
    
    // Si ya se envió una respuesta, no enviar otra
    if (res.headersSent) {
        return next(err);
    }
    
    // Errores específicos de Mongoose/MongoDB
    let statusCode = 500;
    let message = 'Error interno del servidor';
    
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Error de validación';
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'ID inválido';
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Registro duplicado';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token inválido';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expirado';
    }
    
    res.status(statusCode).json({
        success: false,
        error: message,
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ========== ✅ EXPORT ==========
module.exports = app;