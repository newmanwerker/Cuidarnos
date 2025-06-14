const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/disponibilidad?medicoId=12&fecha=2025-06-20
router.get('/disponibilidad', async (req, res) => {
  const { medicoId, fecha } = req.query;

  try {
    const result = await pool.query(`
      SELECT d.hora
      FROM disponibilidad_medica d
      LEFT JOIN consultas_telemedicina c
        ON d.doctor_id = c.medico_id
        AND d.fecha = $2
        AND d.hora = c.fecha_consulta::time
      WHERE d.fecha = $2
        AND d.doctor_id = $1
        AND c.id IS NULL
      ORDER BY d.hora
    `, [medicoId, fecha]);

    res.json(result.rows.map(r => r.hora));
  } catch (err) {
    console.error('❌ Error al obtener disponibilidad:', err);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
});

// POST /api/consultas
router.post('/consultas', async (req, res) => {
  const { pacienteId, medicoId, fecha, hora, tipo, notas } = req.body;

  try {
    const fechaHora = `${fecha} ${hora}`;

    await pool.query(`
      INSERT INTO consultas_telemedicina 
        (paciente_id, medico_id, fecha_consulta, motivo_consulta, nota)
      VALUES ($1, $2, $3, $4, $5)
    `, [pacienteId, medicoId, fechaHora, tipo, notas]);

    res.json({ message: 'Consulta agendada con éxito' });
  } catch (err) {
    console.error('❌ Error al agendar consulta:', err);
    res.status(500).json({ error: 'Error al agendar consulta' });
  }
});

module.exports = router;
