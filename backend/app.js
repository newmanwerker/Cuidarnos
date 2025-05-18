const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth.routes');

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});

const centrosRoutes = require('./routes/centros.routes');
app.use('/api', centrosRoutes);
