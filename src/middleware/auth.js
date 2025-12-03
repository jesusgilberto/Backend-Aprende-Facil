const jwt = require('jsonwebtoken');
const User = require('../modules/users/user.model');
const config = require('../config');

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Verificar si existe el token en los headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado - Token no proporcionado',
            });
        }

        // Verificar token
        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_SECRET);
        } catch (err) {
            // Diferenciar token expirado vs inválido
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Token expirado' });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ success: false, message: 'Token inválido' });
            }
            // Otros errores
            console.error('Error verificando token:', err);
            return res.status(401).json({ success: false, message: 'Error verificando token' });
        }

        // Obtener usuario del token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Usuario desactivado',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error en middleware auth:', error);
        return res.status(401).json({
            success: false,
            message: 'Token inválido',
        });
    }
};

// Middleware para autorizar roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `El rol ${req.user.role} no tiene acceso a esta ruta`,
            });
        }
        next();
    };
};
