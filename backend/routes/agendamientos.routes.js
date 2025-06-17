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
            AND DATE(c.fecha_consulta) = d.fecha
            AND to_char(c.fecha_consulta, 'HH24:MI') = to_char(d.hora, 'HH24:MI')
            AND c.estado = 'pendiente'
        )
      ORDER BY d.hora
    `, [medicoId, fecha]);

    res.json(result.rows.map(r => r.hora.slice(0, 5)));
  } catch (err) {
    console.error('❌ Error al obtener disponibilidad:', err);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
});

// POST /api/consultas
router.post('/consultas', async (req, res) => {
  const { pacienteId, medicoId, fecha, hora, tipo, notas } = req.body;

  try {
    const horaRecortada = hora.slice(0, 5);
    const fechaHora = `${fecha}T${horaRecortada}:00`;

    // Verificar que paciente y médico pertenezcan al mismo centro
    const [pacienteCentro, medicoCentro] = await Promise.all([
      pool.query(`SELECT id_centro_salud FROM pacientes WHERE id = $1`, [pacienteId]),
      pool.query(`SELECT id_centro_salud FROM medicos WHERE id = $1`, [medicoId])
    ]);

    if (
      pacienteCentro.rows.length === 0 ||
      medicoCentro.rows.length === 0 ||
      pacienteCentro.rows[0].id_centro_salud !== medicoCentro.rows[0].id_centro_salud
    ) {
      return res.status(403).json({ error: 'Solo puedes agendar con médicos de tu centro de salud.' });
    }

    // 🛑 Validar si ya existe una consulta ese día para el paciente
    const consultaExistente = await pool.query(`
      SELECT 1 FROM consultas_telemedicina
      WHERE paciente_id = $1 AND DATE(fecha_consulta) = $2
    `, [pacienteId, fecha]);

    if (consultaExistente.rowCount > 0) {
      return res.status(400).json({ error: 'Ya tienes una consulta agendada para este día.' });
    }

    console.log('🕓 Agendando para:', fechaHora);

    // Convertir a UTC con zona horaria de Chile
    const fechaHoraLocal = new Date(`${fechaHora}-04:00`);
    const startDate = fechaHoraLocal.toISOString();
    const endDate = new Date(fechaHoraLocal.getTime() + 20 * 60000).toISOString();

    // Crear sala en Whereby
    const axios = require('axios');
    const apiKey = process.env.WHEREBY_API_KEY;

    const roomResponse = await axios.post('https://api.whereby.dev/v1/meetings', {
      startDate,
      endDate,
      roomMode: 'normal',
      fields: ['hostRoomUrl', 'roomUrl '],
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const { hostRoomUrl, roomUrl  } = roomResponse.data;

    // Guardar consulta con enlaces
    await pool.query(`
      INSERT INTO consultas_telemedicina 
        (paciente_id, medico_id, fecha_consulta, motivo_consulta, nota, estado, link_sala_paciente, link_sala_medico)
      VALUES ($1, $2, $3::timestamp, $4, $5, 'pendiente', $6, $7)
    `, [pacienteId, medicoId, fechaHora, tipo, notas, viewerRoomUrl, hostRoomUrl]);

    res.json({
      message: 'Consulta agendada con éxito',
      link_sala: roomUrl ,
      link_sala_host: hostRoomUrl
    });
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

// GET /api/doctor-disponible?fecha=2025-06-20&centroSaludId=1
router.get('/doctor-disponible', async (req, res) => {
  const { fecha, centroSaludId } = req.query;

  try {
    console.log('🔍 Buscando doctor en fecha:', fecha, 'y centro:', centroSaludId); // 👈 agrega esta línea

    const result = await pool.query(`
      SELECT DISTINCT ON (m.id) m.id, m.nombre, m.especialidad
      FROM disponibilidad_medica d
      JOIN medicos m ON d.doctor_id = m.id
      WHERE d.fecha = $1
        AND m.id_centro_salud = $2
      ORDER BY m.id
      LIMIT 1
    `, [fecha, centroSaludId]);

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



// GET /api/dias-disponibles?centroSaludId=1

router.get('/dias-disponibles', async (req, res) => {
  const { centroSaludId } = req.query;

  if (!centroSaludId) {
    return res.status(400).json({ error: 'Falta el ID del centro de salud' });
  }

  try {
    const result = await pool.query(`
      SELECT DISTINCT d.fecha
      FROM disponibilidad_medica d
      JOIN medicos m ON d.doctor_id = m.id
      WHERE d.fecha >= (NOW() AT TIME ZONE 'Chile/Continental')::date
        AND m.id_centro_salud = $1
      ORDER BY d.fecha
    `, [centroSaludId]);

    const fechas = result.rows.map(row => row.fecha.toISOString().split('T')[0]);
    res.json(fechas);
  } catch (err) {
    console.error('❌ Error al obtener días disponibles:', err);
    res.status(500).json({ error: 'Error al obtener días disponibles' });
  }
});


// GET /api/consultas/existe
router.get('/consultas/existe', async (req, res) => {
  const { pacienteId, medicoId, fecha, hora } = req.query;

  if (!pacienteId || !medicoId || !fecha || !hora) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  try {
    const horaRecortada = hora.slice(0, 5);
    const fechaHora = `${fecha}T${horaRecortada}:00`;

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
        AND fecha_consulta::date = (NOW() AT TIME ZONE 'Chile/Continental')::date
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
      SELECT 
        c.id, 
        c.paciente_id, 
        c.fecha_consulta, 
        c.motivo_consulta, 
        c.estado,
        CONCAT(p.nombre, ' ', p.apellido) AS paciente_nombre, 
        p.rut
      FROM consultas_telemedicina c
      JOIN pacientes p ON p.id = c.paciente_id
      WHERE c.medico_id = $1
        AND c.fecha_consulta::date = (NOW() AT TIME ZONE 'Chile/Continental')::date
      ORDER BY c.fecha_consulta ASC
    `, [medicoId]);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener consultas del día:', err);
    res.status(500).json({ error: 'Error al obtener consultas del día' });
  }
});



module.exports = router;
