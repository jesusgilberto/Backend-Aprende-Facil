const express = require('express');
const router = express.Router();
const { login } = require('./auth.controller');
const validate = require('../../middleware/validation');
const { loginValidators } = require('./auth.validation');

router.post('/login', loginValidators, validate, login);

module.exports = router;
