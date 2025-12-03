require('dotenv').config();

const http = require('http');
const connectDB = require('./config/database');
const app = require('./app');
const config = require('./config');

const PORT = config.PORT || process.env.PORT || 3001;

// Conectar a la base de datos antes de levantar el servidor
connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(
            `FATAL: El puerto ${PORT} ya está en uso. Cierra el proceso que lo ocupa o cambia PORT en .env.`,
        );
        console.error(
            'Sugerencia: en Git Bash: `netstat -ano | grep 3001` y luego `taskkill /PID <PID> /F` (CMD/PowerShell).',
        );
        throw new Error(`FATAL: El puerto ${PORT} ya está en uso.`);
    }
    console.error('Error en el servidor:', err);
    throw err;
});
