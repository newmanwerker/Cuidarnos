require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PG_HOST,
  database: process.env.PGDATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10, // máximo 10 conexiones
  idleTimeoutMillis: 10000 // libera conexiones inactivas después de 10s
});

module.exports = pool;
