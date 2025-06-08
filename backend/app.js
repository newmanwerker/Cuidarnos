const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//Rutes
const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

//Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ BE server running on http://0.0.0.0:${PORT}`);
});

const centrosRoutes = require('./routes/centros.routes');
app.use('/api', centrosRoutes);
