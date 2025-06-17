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
    // Obtener ficha + nombre del centro
    const fichaResult = await pool.query(`
      SELECT f.*, c.nombre AS nombre_centro
      FROM ficha_paciente f
      LEFT JOIN centro_salud c ON f.centro_salud_id = c.id
      WHERE f.paciente_id = $1
    `, [id]);

    if (fichaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ficha no encontrada' });
    }

    const ficha = fichaResult.rows[0];

    // Condiciones médicas
    const condiciones = await pool.query(`
      SELECT 
        cm.*, 
        m.nombre AS nombre_doctor_tratante,
        m.apellido AS apellido_doctor_tratante
      FROM condicion_medica cm
      LEFT JOIN medicos m ON cm.doctor_tratante_id = m.id
      WHERE cm.ficha_paciente_id = $1
    `, [ficha.id]);

    // Medicamentos
    const medicamentos = await pool.query(`
      SELECT 
        med.*, 
        m.nombre AS nombre_medico_receta,
        m.apellido AS apellido_medico_receta
      FROM medicamento med
      LEFT JOIN medicos m ON med.medico_id = m.id
      WHERE med.paciente_id = $1
    `, [id]);

    // Resultados de laboratorio
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
      SELECT id, descripcion, severidad, causa
      FROM alergia
      WHERE paciente_id = $1
    `, [id]);

    // Reunión pendiente más próxima
    const reunion = await pool.query(`
      SELECT link_sala_paciente
      FROM consultas_telemedicina
      WHERE paciente_id = $1 AND estado = 'pendiente'
      ORDER BY fecha_consulta ASC
      LIMIT 1
    `, [id]);

    const linkSalaPaciente = reunion.rows[0]?.link_sala_paciente || null;

    res.json({
      ficha,
      condiciones: condiciones.rows,
      medicamentos: medicamentos.rows,
      examenes: examenes.rows,
      receta,
      alergias: alergias.rows,
      linkSalaPaciente // <--- se incluye en la respuesta
    });
  } catch (err) {
    console.error('❌ Error al obtener ficha completa:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});



// GET /api/pacientes/centro/:centroSaludId
router.get('/centro/:centroSaludId', async (req, res) => {
  const { centroSaludId } = req.params;

  if (!centroSaludId) {
    return res.status(400).json({ error: 'Falta el ID del centro de salud' });
  }

  try {
    const result = await pool.query(`
      SELECT id, nombre, apellido, rut
      FROM pacientes
      WHERE id_centro_salud = $1
      ORDER BY nombre
    `, [centroSaludId]);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener pacientes del centro:', err);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});


// PUT /api/pacientes/:id/ficha
router.put('/:id/ficha', async (req, res) => {
  const { id } = req.params;
  const {
    contacto_emergencia,
    parentezco_contacto,
    altura,
    peso
  } = req.body;

  try {
    // Actualizar la ficha del paciente
    const result = await pool.query(`
      UPDATE ficha_paciente
      SET
        contacto_emergencia = $1,
        parentezco_contacto = $2,
        altura = $3,
        peso = $4
      WHERE paciente_id = $5
      RETURNING *
    `, [
      contacto_emergencia || null,
      parentezco_contacto || null,
      altura || null,
      peso || null,
      id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Ficha del paciente no encontrada' });
    }

    res.json({ message: 'Ficha actualizada correctamente', ficha: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al actualizar ficha del paciente:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /api/condiciones
router.post('/condiciones', async (req, res) => {
  const {
    ficha_paciente_id,
    nombre,
    severidad,
    estado,
    notas,
    doctor_tratante_id
  } = req.body;

  if (!ficha_paciente_id || !nombre || !doctor_tratante_id) {
    return res.status(400).json({ error: 'Faltan datos obligatorios (ficha_paciente_id, nombre, doctor_tratante_id)' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO condicion_medica (
        ficha_paciente_id,
        nombre,
        severidad,
        estado,
        notas,
        doctor_tratante_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      ficha_paciente_id,
      nombre,
      severidad || null,
      estado || null,
      notas || null,
      doctor_tratante_id
    ]);

    res.status(201).json({ message: 'Condición médica añadida', condicion: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al insertar condición médica:', err);
    res.status(500).json({ error: 'Error al insertar condición médica' });
  }
});


router.put('/condiciones/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, severidad, estado, notas, doctor_tratante_id } = req.body;

  try {
    const result = await pool.query(`
      UPDATE condicion_medica
      SET nombre = $1, severidad = $2, estado = $3, notas = $4, doctor_tratante_id = $5
      WHERE id = $6
      RETURNING *
    `, [nombre, severidad, estado, notas, doctor_tratante_id, id]);

    res.json({ message: 'Condición actualizada', condicion: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al actualizar condición médica:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


router.delete('/condiciones/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM condicion_medica WHERE id = $1', [id]);
    res.json({ message: 'Condición eliminada' });
  } catch (err) {
    console.error('❌ Error al eliminar condición médica:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


router.post('/alergias', async (req, res) => {
  const { paciente_id, descripcion, severidad, causa } = req.body;

  if (!paciente_id || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO alergia (paciente_id, descripcion, severidad, causa)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [paciente_id, descripcion, severidad || null, causa || null]);

    res.status(201).json({ message: 'Alergia añadida', alergia: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al insertar alergia:', err);
    res.status(500).json({ error: 'Error al insertar alergia' });
  }
});


router.put('/alergias/:id', async (req, res) => {
  const { id } = req.params;
  const { descripcion, severidad, causa } = req.body;

  try {
    const result = await pool.query(`
      UPDATE alergia
      SET descripcion = $1, severidad = $2, causa = $3
      WHERE id = $4
      RETURNING *
    `, [descripcion, severidad, causa, id]);

    res.json({ message: 'Alergia actualizada', alergia: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al actualizar alergia:', err);
    res.status(500).json({ error: 'Error al actualizar alergia' });
  }
});



router.delete('/alergias/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM alergia WHERE id = $1', [id]);
    res.json({ message: 'Alergia eliminada' });
  } catch (err) {
    console.error('❌ Error al eliminar alergia:', err);
    res.status(500).json({ error: 'Error al eliminar alergia' });
  }
});


// POST /api/pacientes/recetas
router.post('/recetas', async (req, res) => {
  const { id_paciente, fecha_termino, observacion } = req.body;

  if (!id_paciente) {
    return res.status(400).json({ error: 'Falta el id del paciente' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO receta (id_paciente, fecha_emision, fecha_termino, observacion)
      VALUES ($1, CURRENT_DATE, $2, $3)
      RETURNING *
    `, [id_paciente, fecha_termino || null, observacion || null]);

    res.status(201).json({ message: 'Receta creada', receta: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al crear receta:', err);
    res.status(500).json({ error: 'Error al crear receta' });
  }
});




// POST /api/pacientes/medicamentos
router.post('/medicamentos', async (req, res) => {
  const {
    paciente_id,
    nombre,
    dosis_mg,
    frecuencia,
    proposito,
    efectos_secundarios,
    notas,
    medico_id,
    fecha_termino,
    id_receta
  } = req.body;

  if (!paciente_id || !nombre || !dosis_mg || !frecuencia || !medico_id || !id_receta) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO medicamento (
        paciente_id, nombre, dosis_mg, frecuencia, proposito, efectos_secundarios,
        notas, medico_id, fecha_inicio, fecha_termino, id_receta
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE, $9, $10)
      RETURNING *
    `, [
      paciente_id,
      nombre,
      dosis_mg,
      frecuencia,
      proposito || null,
      efectos_secundarios || null,
      notas || null,
      medico_id,
      fecha_termino || null,
      id_receta
    ]);

    res.status(201).json({ message: 'Medicamento añadido', medicamento: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al añadir medicamento:', err);
    res.status(500).json({ error: 'Error al añadir medicamento' });
  }
});




router.put('/medicamentos/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    dosis_mg,
    frecuencia,
    proposito,
    efectos_secundarios,
    notas,
    fecha_termino
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE medicamento
      SET nombre = $1,
          dosis_mg = $2,
          frecuencia = $3,
          proposito = $4,
          efectos_secundarios = $5,
          notas = $6,
          fecha_termino = $7
      WHERE id = $8
      RETURNING *
    `, [
      nombre,
      dosis_mg,
      frecuencia,
      proposito || null,
      efectos_secundarios || null,
      notas || null,
      fecha_termino || null,
      id
    ]);

    res.json({ message: 'Medicamento actualizado', medicamento: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al actualizar medicamento:', err);
    res.status(500).json({ error: 'Error al actualizar medicamento' });
  }
});



router.delete('/medicamentos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM medicamento WHERE id = $1', [id]);
    res.json({ message: 'Medicamento eliminado' });
  } catch (err) {
    console.error('❌ Error al eliminar medicamento:', err);
    res.status(500).json({ error: 'Error al eliminar medicamento' });
  }
});




module.exports = router;
