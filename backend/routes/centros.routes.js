const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/centros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM centro_salud ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al consultar centros:', err);
    res.status(500).json({ error: 'Error al obtener centros de salud' });
  }
});

module.exports = router;
