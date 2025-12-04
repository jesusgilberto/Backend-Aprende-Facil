require('dotenv').config();

// Solo cargar .env.development si existe y estamos en desarrollo
if (process.env.NODE_ENV === 'development') {
  try {
    require('dotenv').config({ path: '.env.development' });
  } catch (error) {
    console.log('⚠️  .env.development no encontrado, usando .env');
  }
}

const config = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Validaciones
console.log('=== 🔍 CONFIGURACIÓN ===');
console.log(`   PORT: ${config.PORT}`);
console.log(`   MONGODB_URI: ${config.MONGODB_URI ? '✅ Definida' : '❌ NO DEFINIDA'}`);
console.log(`   JWT_SECRET: ${config.JWT_SECRET ? '✅ Definida' : '❌ NO DEFINIDA'}`);
console.log(`   JWT_EXPIRES_IN: ${config.JWT_EXPIRES_IN}`);
console.log(`   NODE_ENV: ${config.NODE_ENV}`);
console.log('=========================');

if (!config.MONGODB_URI) {
  console.error('❌ ERROR CRÍTICO: MONGODB_URI no está definida');
  if (config.NODE_ENV === 'production') {
    console.error('   En Railway, asegúrate de tener la variable MONGODB_URI');
    process.exit(1);
  }
}

if (!config.JWT_SECRET && config.NODE_ENV === 'production') {
  console.error('❌ ERROR: JWT_SECRET no definido en producción');
  process.exit(1);
}

// En producción, exigir MONGODB_URI definido (evitar default localhost)
if (config.NODE_ENV === 'production') {
  const isLocalDefault = !config.MONGODB_URI && config.MONGODB_URI.includes('localhost');
  if (isLocalDefault) {
    console.error(
      'FATAL: MONGODB_URI no definido en producción. Configura MONGODB_URI en variables del entorno (Railway/Atlas).',
    );
    throw new Error(
      'FATAL: MONGODB_URI no definido en producción. Configura MONGODB_URI en variables del entorno (Railway/Atlas).',
    );
  }
}


module.exports = config;