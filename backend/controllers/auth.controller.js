const pool = require('../db');

exports.loginPaciente = async (req, res) => {
  const { rut, nombre } = req.body;

  try {
    console.log('📥 RUT recibido:', rut);
    console.log('📥 Nombre recibido:', nombre);

    // Consulta para traer datos del paciente + centro de salud
    const result = await pool.query(
      `SELECT p.*, cs.nombre AS centro_salud 
       FROM pacientes p
       JOIN centro_salud cs ON p.id_centro_salud = cs.id
       WHERE p.rut = $1 AND LOWER(p.nombre) = LOWER($2)`,
      [rut, nombre]
    );

    if (result.rows.length === 0) {
      console.log('❌ Paciente no encontrado');
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const paciente = result.rows[0];

    // Consulta para traer ficha médica
    const fichaResult = await pool.query(
      `SELECT * FROM ficha_paciente WHERE id = $1`,
      [paciente.id_ficha_paciente]
    );
    const ficha_medica = fichaResult.rows[0] || null;
    //Convierte el array del historial_medico en texto
    if (ficha_medica && typeof ficha_medica.historial_medico === 'string') {
      ficha_medica.historial_medico = ficha_medica.historial_medico
      .replace(/[{}]/g,'')//elimina las llaves del array
      .split(',') //Separta los items con comas
      .map(item => item.trim()); //elimina espacion en blanco
    }
    console.log(`✅ Login exitoso para paciente: ${paciente.nombre} (${paciente.rut})`);
    console.log('🩺 Historial médico:', ficha_medica?.historial_medico);

    res.json({
      message: 'Login exitoso',
      paciente: {
        // Datos desde la tabla pacientes
        id: paciente.id,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        fecha_nacimiento: paciente.fecha_nacimiento,
        genero: paciente.genero,
        direccion: paciente.direccion,
        telefono: paciente.telefono,
        email: paciente.email,
        rut: paciente.rut,
        centro_salud: paciente.centro_salud,

        // Datos adicionales desde ficha_medica
        ficha_medica: {
          id: ficha_medica?.id,
          nombre: ficha_medica?.nombre,
          apellido: ficha_medica?.apellido,
          fecha_nac: ficha_medica?.fecha_nac,
          edad: ficha_medica?.edad,
          altura: ficha_medica?.altura,
          peso: ficha_medica?.peso,
          tipo_sangre: ficha_medica?.tipo_sangre,
          direccion: ficha_medica?.direccion,
          celular: ficha_medica?.celular,
          email: ficha_medica?.email,
          contacto_emergencia: ficha_medica?.contacto_emergencia,
          parentezco_contacto: ficha_medica?.parentezco_contacto,
          activo: ficha_medica?.activo,
          historial_medico: ficha_medica?.historial_medico || []
        }
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
