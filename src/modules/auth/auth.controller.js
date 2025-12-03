const User = require('../users/user.model');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const asyncHandler = require('../../middleware/asyncHandler');

// Login with email or username + password
exports.login = asyncHandler(async (req, res) => {
    const { identifier, email, username, password } = req.body;

    if ((!identifier && !email && !username) || !password) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    const lookup = identifier || email || username;

    const user = await User.findOne({ $or: [{ email: lookup }, { username: lookup }] }).select(
        '+password',
    );
    if (!user) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });

    res.json({
        success: true,
        token,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    });
});
