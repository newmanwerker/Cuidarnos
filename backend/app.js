const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const centrosRoutes = require('./routes/centros.routes');
app.use('/api', centrosRoutes);

const agendamientosRoutes = require('./routes/agendamientos.routes');
app.use('/api', agendamientosRoutes);

// Verificar zona horaria de la BD
const pool = require('./db');
pool.query("SELECT now()", (err, res) => {
  if (err) {
    console.error('❌ Error al obtener la hora desde la base de datos:', err);
  } else {
    console.log('🕒 Hora actual en base de datos (esperada: hora Chile):', res.rows[0].now);
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ BE server running on http://0.0.0.0:${PORT}`);
});
