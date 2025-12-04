const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ========== ✅ MIDDLEWARE BÁSICO ==========
app.use(cors());
app.use(express.json());

// ========== ✅ RUTAS ==========
const authRoutes = require('./modules/auth/auth.route');
const userRoutes = require('./modules/users/user.route');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ========== ✅ RUTAS DE SALUD Y TEST ==========
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

// ========== ✅ RUTAS DE TEST ==========
app.get('/api/test-simple', (req, res) => {
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
    res.json({ 
        success: true,
        public: true,
        message: 'Ruta pública sin autenticación',
        timestamp: new Date().toISOString()
    });
});

// ========== ✅ RUTA 404 ==========
app.use((req, res) => {
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
            'GET /api/users/me (requiere token)'
        ]
    });
});

// ========== ✅ ERROR HANDLER ==========
app.use((err, req, res, next) => {
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