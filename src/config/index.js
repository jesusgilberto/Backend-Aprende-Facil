require('dotenv').config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
    console.error(
        'FATAL: JWT_SECRET no definido. Define JWT_SECRET en las variables de entorno y reinicia la aplicación.',
    );
    throw new Error(
        'FATAL: JWT_SECRET no definido. Define JWT_SECRET en las variables de entorno y reinicia la aplicación.',
    );
}

if (!MONGODB_URI) {
    console.error(
        'FATAL: MONGODB_URI no definido. Define MONGODB_URI en las variables de entorno (Railway / Heroku / .env) y reinicia la aplicación.',
    );
    throw new Error(
        'FATAL: MONGODB_URI no definido. Define MONGODB_URI en las variables de entorno.',
    );
}

module.exports = { PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN };
