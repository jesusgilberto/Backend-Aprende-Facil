// test-minimal.js - SERVIDOR MÍNIMO QUE SIEMPRE FUNCIONA
console.log('='.repeat(60));
console.log('🚀 SERVIDOR MÍNIMO DE PRUEBA');
console.log('='.repeat(60));
console.log(`📅 ${new Date().toLocaleString()}`);
console.log(`🔧 Node: ${process.version}`);

// Verificar módulos críticos
try {
    require('express');
    console.log('✅ express: OK');
} catch (e) {
    console.log('❌ express:', e.message);
}

try {
    require('mongoose');
    console.log('✅ mongoose: OK');
} catch (e) {
    console.log('❌ mongoose:', e.message);
}

// Crear servidor HTTP simple
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`📨 ${req.method} ${req.url}`);
    
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            message: '✅ Servidor mínimo funcionando',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    if (req.url === '/api/test') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'Test exitoso'
        }));
        return;
    }
    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        error: 'Ruta no encontrada',
        available: ['/health', '/api/test']
    }));
});

// Usar el puerto de Railway
const PORT = process.env.PORT || 8080;

server.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('✅ SERVIDOR INICIADO EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL: https://backend-aprende-facil-production.up.railway.app`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
    console.log('📋 Endpoints:');
    console.log(`   GET https://backend-aprende-facil-production.up.railway.app/health`);
    console.log(`   GET https://backend-aprende-facil-production.up.railway.app/api/test`);
    console.log('='.repeat(60));
});

// Mantener vivo
setInterval(() => {
    console.log(`🔄 Activo: ${Math.floor(process.uptime())}s`);
}, 30000);

// Manejar señales
process.on('SIGTERM', () => {
    console.log('⚠️  SIGTERM recibido');
    server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
    console.log('⚠️  SIGINT recibido');
    server.close(() => process.exit(0));
});