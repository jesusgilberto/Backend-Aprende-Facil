const User = require('./user.model');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const asyncHandler = require('../../middleware/asyncHandler');

// Register new user
exports.register = asyncHandler(async (req, res) => {
    const { username, firstName, lastName, age, email, password } = req.body;

    if (!username || !firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    // Check duplicates by email or username
    let existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
        return res.status(400).json({ success: false, message: 'Email o username ya en uso' });
    }

    const user = await User.create({ username, firstName, lastName, age, email, password });

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });

    res.status(201).json({
        success: true,
        data: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        token,
    });
});

// Get current user profile (requires protect middleware)
exports.getMe = asyncHandler(async (req, res) => {
    res.json({ success: true, data: req.user });
});
