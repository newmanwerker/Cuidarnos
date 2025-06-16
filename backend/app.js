const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Importar rutas
const authRoutes = require('./routes/auth.routes');
const centrosRoutes = require('./routes/centros.routes');
const agendamientosRoutes = require('./routes/agendamientos.routes');
const pacientesRoutes = require('./routes/pacientes.routes');

// 🔹 Usar rutas
app.use('/api', authRoutes);
app.use('/api', centrosRoutes);
app.use('/api', agendamientosRoutes);
app.use('/api/pacientes', pacientesRoutes);


// 🔹 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ BE server running on http://0.0.0.0:${PORT}`);
});
