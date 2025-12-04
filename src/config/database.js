const mongoose = require('mongoose');
const { MONGODB_URI } = require('./index');

const redactUri = (uri) => {
    if (!uri) return uri;
    try {
        return uri.replace(/\/\/(.*@)/, '//<REDACTED>@');
    } catch (e) {
        return '<REDACTED>';
    }
};

const connectDB = async () => {
    try {
        console.log(`🔗 Conectando a MongoDB: ${redactUri(MONGODB_URI)}`);
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        console.error('FATAL: no se pudo conectar a la base de datos. Abortando inicio.');
        throw error;
    }
};

module.exports = connectDB;
