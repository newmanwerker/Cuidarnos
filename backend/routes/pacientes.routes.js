const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/pacientes/busqueda?centroSaludId=1&query=juan
router.get('/busqueda', async (req, res) => {
  const { centroSaludId, query } = req.query;

  if (!centroSaludId || !query) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos (centroSaludId y query)' });
  }

  try {
    const centroIdParsed = parseInt(centroSaludId, 10);

    const result = await pool.query(`
      SELECT id, nombre, apellido, rut
      FROM pacientes
      WHERE id_centro_salud = $1
        AND (
          LOWER(nombre) LIKE LOWER('%' || $2 || '%') OR
          LOWER(apellido) LIKE LOWER('%' || $2 || '%') OR
          rut ILIKE '%' || $2 || '%'
        )
      ORDER BY nombre
      LIMIT 20
    `, [centroIdParsed, query]);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al buscar pacientes:', err);
    res.status(500).json({ error: 'Error del servidor al buscar pacientes' });
  }
});


module.exports = router;
