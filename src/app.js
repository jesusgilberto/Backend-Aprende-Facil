const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./modules/auth/auth.route');
const userRoutes = require('./modules/users/user.route');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        message: '✅ Backend funcionando correctamente!',
        timestamp: new Date().toISOString(),
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Error handler (último middleware)
app.use(errorHandler);

module.exports = app;
