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
  WHERE d.fecha = $2
    AND d.doctor_id = $1
    AND NOT EXISTS (
      SELECT 1
      FROM consultas_telemedicina c
      WHERE c.medico_id = d.doctor_id
        AND DATE(c.fecha_consulta AT TIME ZONE 'UTC' AT TIME ZONE 'America/Santiago') = d.fecha
        AND to_char(c.fecha_consulta AT TIME ZONE 'UTC' AT TIME ZONE 'America/Santiago', 'HH24:MI') = to_char(d.hora, 'HH24:MI')
        AND c.estado = 'pendiente'
    )
  ORDER BY d.hora
`, [medicoId, fecha]);
    res.json(result.rows.map(r => r.hora.slice(0,5)));
  } catch (err) {
    console.error('❌ Error al obtener disponibilidad:', err);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
});

// POST /api/consultas
router.post('/consultas', async (req, res) => {
  const { pacienteId, medicoId, fecha, hora, tipo, notas } = req.body;

  try {
    const pendienteResult = await pool.query(`
      SELECT * FROM consultas_telemedicina
      WHERE paciente_id = $1 AND estado = 'pendiente'
    `, [pacienteId]);

    if (pendienteResult.rows.length > 0) {
      return res.status(409).json({ error: 'Ya tienes una consulta pendiente. Finalízala antes de agendar otra.' });
    }

    // 🛠️ Normaliza la hora si viene con segundos
    const horaRecortada = hora.slice(0, 5); // "08:20" incluso si vino "08:20:00"
    const fechaHora = new Date(`${fecha}T${horaRecortada}:00-04:00`).toISOString();

    console.log('🕓 Agendando para:', fechaHora);

    await pool.query(`
      INSERT INTO consultas_telemedicina 
        (paciente_id, medico_id, fecha_consulta, motivo_consulta, nota, estado)
      VALUES ($1, $2, $3, $4, $5, 'pendiente')
    `, [pacienteId, medicoId, fechaHora, tipo, notas]);

    res.json({ message: 'Consulta agendada con éxito' });
  } catch (err) {
    console.error('❌ Error al agendar consulta:', err.message);
    res.status(500).json({ error: 'Error al agendar consulta' });
  }
});

// GET /api/doctores
router.get('/doctores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre AS name, especialidad 
      FROM medicos
      ORDER BY nombre
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener doctores:', err);
    res.status(500).json({ error: 'Error al obtener doctores' });
  }
});

router.get('/doctor-disponible', async (req, res) => {
  const { fecha } = req.query;

  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (m.id) m.id, m.nombre, m.especialidad
      FROM disponibilidad_medica d
      JOIN medicos m ON d.doctor_id = m.id
      WHERE d.fecha = $1
      ORDER BY m.id
      LIMIT 1
    `, [fecha]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'No hay médico disponible ese día' });
    }
  } catch (err) {
    console.error('❌ Error al obtener doctor disponible:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/dias-disponibles', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT fecha
      FROM disponibilidad_medica
      WHERE fecha >= CURRENT_DATE
      ORDER BY fecha
    `);

    const fechas = result.rows.map(row => row.fecha.toISOString().split('T')[0]);
    res.json(fechas);
  } catch (err) {
    console.error('❌ Error al obtener días disponibles:', err);
    res.status(500).json({ error: 'Error al obtener días disponibles' });
  }
});

// CORREGIDO: Comparar usando ISO con zona horaria
router.get('/consultas/existe', async (req, res) => {
  const { pacienteId, medicoId, fecha, hora } = req.query;

  if (!pacienteId || !medicoId || !fecha || !hora) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  try {
    const fechaHora = new Date(`${fecha}T${hora}:00-04:00`).toISOString();

    const result = await pool.query(
      `SELECT COUNT(*) FROM consultas_telemedicina 
       WHERE paciente_id = $1 AND medico_id = $2 AND fecha_consulta = $3`,
      [pacienteId, medicoId, fechaHora]
    );

    const existe = parseInt(result.rows[0].count) > 0;
    res.json({ existe });
  } catch (error) {
    console.error('❌ Error al verificar existencia de cita:', error);
    res.status(500).json({ error: 'Error al verificar existencia de la cita' });
  }
});

router.get('/consultas/doctor/hoy', async (req, res) => {
  const { medicoId } = req.query;

  if (!medicoId) {
    return res.status(400).json({ error: 'Falta el ID del médico' });
  }

  try {
    const result = await pool.query(`
      SELECT estado
      FROM consultas_telemedicina
      WHERE medico_id = $1
        AND DATE(fecha_consulta) = CURRENT_DATE
    `, [medicoId]);

    const total = result.rows.length;
    const completadas = result.rows.filter(c => c.estado === 'terminada').length;

    res.json({ total, completadas });
  } catch (err) {
    console.error('❌ Error al contar consultas del día:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas del médico' });
  }
});

// GET /api/consultas/hoy/:medicoId
router.get('/consultas/hoy/:medicoId', async (req, res) => {
  const { medicoId } = req.params;

  try {
    const result = await pool.query(`
      SELECT c.id, c.paciente_id, c.fecha_consulta, c.motivo_consulta, c.estado,
             CONCAT(p.nombre, ' ', p.apellido) AS paciente_nombre, p.rut
      FROM consultas_telemedicina c
      JOIN pacientes p ON p.id = c.paciente_id
      WHERE c.medico_id = $1 AND DATE(c.fecha_consulta) = CURRENT_DATE
      ORDER BY c.fecha_consulta ASC
    `, [medicoId]);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener consultas del día:', err);
    res.status(500).json({ error: 'Error al obtener consultas del día' });
  }
});

module.exports = router;
