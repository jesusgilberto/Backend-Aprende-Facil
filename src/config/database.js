const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // ✅ FORZAR la URI CORRECTA
        const uri = 'mongodb+srv://gilbertoramirez89461_db_user:Lcj9VPyvhJCejqly@aprendefacil.nggyhqs.mongodb.net/v';

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
        });

        return conn;
    } catch (error) {
        console.error('💥 Error MongoDB:', error.message);
        throw error;
    }
};

module.exports = connectDB;