require('dotenv').config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mi-proyecto-educativo';
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
    console.error(
        'FATAL: JWT_SECRET no definido. Define JWT_SECRET en .env y reinicia la aplicación.',
    );
    throw new Error(
        'FATAL: JWT_SECRET no definido. Define JWT_SECRET en .env y reinicia la aplicación.',
    );
}

module.exports = { PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN };
