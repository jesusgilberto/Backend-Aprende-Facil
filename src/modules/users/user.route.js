const express = require('express');
const router = express.Router();
const { register, getMe } = require('./user.controller');
const { protect } = require('../../middleware/auth');
const validate = require('../../middleware/validation');
const { registerValidators } = require('./user.validation');

router.post('/', registerValidators, validate, register);
router.get('/me', protect, getMe);

module.exports = router;
