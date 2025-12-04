// config/index.js - VERSIÓN SIMPLIFICADA
const config = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI, // ✅ DEJA QUE RAILWAY LO PROVEA
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = config;