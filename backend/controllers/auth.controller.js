const pool = require('../db');

exports.loginPaciente = async (req, res) => {
  const { rut, nombre } = req.body;

  try {
    console.log('📥 RUT recibido:', rut);
    console.log('📥 Nombre recibido:', nombre);

    const result = await pool.query(
      'SELECT * FROM pacientes WHERE rut = $1 AND nombre = $2',
      [rut, nombre]
    );

    if (result.rows.length === 0) {
      console.log('❌ Paciente no encontrado');
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const paciente = result.rows[0];

    console.log(`✅ Login exitoso para paciente: ${paciente.nombre} (${paciente.rut})`);

    res.json({
      message: 'Login exitoso',
      paciente: {
        id: paciente.id,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        fecha_nacimiento: paciente.fecha_nacimiento,
        genero: paciente.genero,
        direccion: paciente.direccion,
        telefono: paciente.telefono,
        email: paciente.email,
        rut: paciente.rut
      }
    });

  } catch (error) {
    console.error('❌ Error del servidor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};