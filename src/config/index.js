// config/index.js - VERSIÓN SIMPLIFICADA
const config = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI, // ✅ DEJA QUE RAILWAY LO PROVEA
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Solo para debug - mostrar qué se está usando
console.log('=== 🔧 CONFIGURACIÓN FINAL ===');
console.log(`   PORT: ${config.PORT}`);
console.log(`   MONGODB_URI: ${config.MONGODB_URI ? '✅ Definida' : '❌ NO DEFINIDA'}`);
if (config.MONGODB_URI) {
  console.log(`   URI: ${config.MONGODB_URI.substring(0, 60)}...`);
}
console.log(`   JWT_SECRET: ${config.JWT_SECRET ? '✅' : '❌'}`);
console.log(`   NODE_ENV: ${config.NODE_ENV}`);
console.log('============================');

module.exports = config;