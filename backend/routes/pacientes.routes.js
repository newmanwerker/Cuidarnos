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



// GET /api/pacientes/:id/ficha-completa
router.get('/:id/ficha-completa', async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener ficha
    const fichaResult = await pool.query(`
      SELECT * FROM ficha_paciente WHERE paciente_id = $1
    `, [id]);

    if (fichaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ficha no encontrada' });
    }

    const ficha = fichaResult.rows[0];

    // Condiciones médicas
    const condiciones = await pool.query(`
      SELECT cm.*, m.nombre AS nombre_doctor_tratante
      FROM condicion_medica cm
      LEFT JOIN medicos m ON cm.doctor_tratante_id = m.id
      WHERE cm.ficha_paciente_id = $1
    `, [ficha.id]);

    // Medicamentos
    const medicamentos = await pool.query(`
      SELECT med.*, m.nombre AS nombre_medico_receta
      FROM medicamento med
      LEFT JOIN medicos m ON med.medico_id = m.id
      WHERE med.paciente_id = $1
    `, [id]);

    // Resultados laboratorio
    const examenes = await pool.query(`
      SELECT id, descripcion, fecha, archivo_pdf
      FROM resultado_laboratorio
      WHERE paciente_id = $1
      ORDER BY fecha DESC
    `, [id]);

    // Receta más reciente
    const recetaResult = await pool.query(`
      SELECT *
      FROM receta
      WHERE id_paciente = $1
      ORDER BY fecha_emision DESC
      LIMIT 1
    `, [id]);
    const receta = recetaResult.rows[0] || null;

    // Alergias
    const alergias = await pool.query(`
      SELECT descripcion, severidad, causa
      FROM alergia
      WHERE paciente_id = $1
    `, [id]);

    res.json({
      ficha,
      condiciones: condiciones.rows,
      medicamentos: medicamentos.rows,
      examenes: examenes.rows,
      receta: receta,
      alergias: alergias.rows
    });
  } catch (err) {
    console.error('❌ Error al obtener ficha completa:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});




module.exports = router;
