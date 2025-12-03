const { body } = require('express-validator');

exports.registerValidators = [
    body('username')
        .exists({ checkFalsy: true })
        .withMessage('El username es requerido')
        .isLength({ min: 3, max: 30 })
        .withMessage('El username debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El username solo puede contener letras, números y guiones bajos'),

    body('firstName')
        .exists({ checkFalsy: true })
        .withMessage('El nombre es requerido')
        .isLength({ max: 50 })
        .withMessage('El nombre no puede tener más de 50 caracteres'),

    body('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Los apellidos son requeridos')
        .isLength({ max: 80 })
        .withMessage('Los apellidos no pueden tener más de 80 caracteres'),

    body('email')
        .exists({ checkFalsy: true })
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('El email no es válido')
        .normalizeEmail(),

    body('password')
        .exists({ checkFalsy: true })
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('age')
        .optional()
        .isInt({ min: 0, max: 150 })
        .withMessage('La edad debe ser un número válido'),
];
