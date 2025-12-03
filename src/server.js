const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Conectar a base de datos
const connectDB = require('./config/database');
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '✅ Backend funcionando correctamente!',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Algo salió mal en el servidor' 
  });
});

// ✅ RUTA 404 CORREGIDA - Quita el * o usa este formato
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});