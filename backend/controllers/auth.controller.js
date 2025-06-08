const pool = require('../db');

exports.loginPaciente = async (req, res) => {
  const { rut, nombre } = req.body;

  try {
    console.log('📥 RUT recibido:', rut);
    console.log('📥 Nombre recibido:', nombre);

    const result = await pool.query(
      'SELECT * FROM pacientes WHERE rut = $1 AND LOWER(nombre) = LOWER($2)',
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

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

exports.loginUsuario = async (req, res) => {
  const { rut, password } = req.body;

  try {
    let result = await pool.query('SELECT * FROM pacientes WHERE rut = $1', [rut]);
    let tipo = 'paciente';

    if (result.rows.length === 0) {
      result = await pool.query('SELECT * FROM medicos WHERE rut = $1', [rut]);
      tipo = 'medico';
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'RUT no encontrado' });
    }

    const user = result.rows[0];
    const passwordOk = await bcrypt.compare(password, user.password);

    if (!passwordOk) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, rut: user.rut, tipo },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        rut: user.rut,
        nombre: user.nombre,
        tipo
      }
    });
} catch (error) {
    console.error('❌ Error en loginUsuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
