const { body } = require('express-validator');

exports.loginValidators = [
    body('password')
        .exists({ checkFalsy: true })
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),

    // Must provide at least one of identifier/email/username
    body().custom((body) => {
        if (!body.identifier && !body.email && !body.username) {
            throw new Error('Se requiere identifier, email o username');
        }
        return true;
    }),
];
