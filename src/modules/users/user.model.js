const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'El nombre de usuario es requerido'],
            unique: true,
            trim: true,
            maxlength: [30, 'El username no puede tener más de 30 caracteres'],
        },
        firstName: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
            maxlength: [50, 'El nombre no puede tener más de 50 caracteres'],
        },
        lastName: {
            type: String,
            required: [true, 'Los apellidos son requeridos'],
            trim: true,
            maxlength: [80, 'Los apellidos no pueden tener más de 80 caracteres'],
        },
        age: {
            type: Number,
            min: [0, 'Edad no válida'],
            max: [150, 'Edad no válida'],
            required: false,
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Por favor ingresa un email válido',
            ],
        },
        password: {
            type: String,
            required: [true, 'La contraseña es requerida'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
            select: false, // No devolver password en las consultas
        },
        role: {
            type: String,
            enum: ['student', 'teacher', 'admin'],
            default: 'student',
        },
        avatar: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Crea createdAt y updatedAt automáticamente
    },
);

// Hash password antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Método para comparar password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = require('mongoose').models.User || mongoose.model('User', userSchema);
