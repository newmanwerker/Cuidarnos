const pool = require('../db');

// controllers/auth.controller.js
exports.loginPaciente = async (req, res) => {
  const { rut, nombre } = req.body;

  try {
    console.log('📥 RUT recibido:', rut);
    console.log('📥 Nombre recibido:', nombre);

    // Buscar paciente por RUT
    const result = await pool.query(
      'SELECT * FROM pacientes WHERE rut = $1 AND nombre = $2',
      [rut, nombre]
    );

    if (result.rows.length === 0) {
      console.log('❌ Paciente no encontrado');
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const paciente = result.rows[0];

    //Success login message
    console.log(`✅ Login exitoso para paciente: ${paciente.nombre} (${paciente.rut})`);

    // Devuelve datos mínimos del paciente
    res.json({
      message: 'Login exitoso',
      paciente: {
        id: paciente.paciente_id,
        nombre: paciente.paciente_nombre,
        rut: paciente.paciente_rut
      }
    });

  } catch (error) {
    console.error('❌ Error del servidor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};