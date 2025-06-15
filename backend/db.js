require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// ⚠️ Railway no permite configurar la zona globalmente,
// así que la forzamos por sesión al conectar:
pool.on('connect', async (client) => {
  try {
    await client.query("SET TIME ZONE 'America/Santiago'");
    console.log('✅ Zona horaria configurada como America/Santiago en Railway');
  } catch (err) {
    console.error('❌ Error al establecer zona horaria:', err);
  }
});

module.exports = pool;
