require('dotenv').config();

// Cargar .env.development si existe en desarrollo
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.development' });
}

const PORT = process.env.PORT || 3001;
let MONGODB_URI = process.env.MONGODB_URI;

// Si estamos en desarrollo y no hay MongoDB local, usar Atlas
if (process.env.NODE_ENV === 'development' && 
    (!MONGODB_URI || MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1'))) {
  
  console.log('⚠️  Desarrollo: No hay MongoDB local, usando Atlas...');
  MONGODB_URI = 'mongodb+srv://gilbertoramirez89461_db_user:Lcj9VPyvhJCejqly@aprendefacil.nggyhqs.mongodb.net/mi-proyecto-educativo?retryWrites=true&w=majority';
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

console.log('=== 🔍 CONFIGURACIÓN CARGADA ===');
console.log(`   PORT: ${PORT}`);
console.log(`   MONGODB_URI: ${MONGODB_URI ? '✅ Definida' : '❌ No definida'}`);
console.log(`   JWT_SECRET: ${JWT_SECRET ? '✅ Definida' : '❌ No definida'}`);
console.log(`   JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log('================================');

if (!JWT_SECRET) {
    console.error('⚠️  JWT_SECRET no definido. Algunas funciones no trabajarán.');
}

module.exports = { PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN };