const pool = require('../db');

exports.loginPersona = async (req, res) => {
  const { rut, nombre } = req.body;

  try {
    console.log('📥 RUT recibido:', rut);
    console.log('📥 Nombre recibido:', nombre);

    // Buscar paciente
    let result = await pool.query(
      `SELECT p.*, cs.nombre AS centro_salud 
       FROM pacientes p
       JOIN centro_salud cs ON p.id_centro_salud = cs.id
       WHERE p.rut = $1 AND LOWER(p.nombre) = LOWER($2)`,
      [rut, nombre]
    );

    if (result.rows.length > 0) {
      const paciente = result.rows[0];

      // Obtener ficha
      const fichaResult = await pool.query(
        `SELECT * FROM ficha_paciente WHERE id = $1`,
        [paciente.id_ficha_paciente]
      );
      const ficha_medica = fichaResult.rows[0] || null;

      if (ficha_medica?.historial_medico) {
        ficha_medica.historial_medico = ficha_medica.historial_medico
          .replace(/[{}]/g, '')
          .split(',')
          .map(item => item.trim());
      }

      // obtener medicamentos de la receta asociada
      const medicamentosResult = await pool.query(
        `SELECT 
          m.nombre, 
          m.dosis_mg AS dosis, 
          m.frecuencia, 
          m.fecha_inicio, 
          m.fecha_termino, 
          m.proposito, 
          m.efectos_secundarios, 
          m.notas, 
          m.medico_id,
          me.nombre AS medico_nombre,
          me.apellido AS medico_apellido  -- 🔹 Añade nombre del médico
        FROM medicamento m
        JOIN receta r ON m.id_receta = r.id_receta
        LEFT JOIN medicos me ON m.medico_id = me.id  -- 🔹 JOIN con la tabla de médicos
        WHERE r.id_paciente = $1`,
        [paciente.id]
      );
      const medicamentos = medicamentosResult.rows || [];


      return res.json({
        message: 'Login exitoso',
        tipo: 'paciente',
        paciente: {
          ...paciente,
          centro_salud: paciente.centro_salud,
          ficha_medica: ficha_medica || {},
          medications: medicamentos, 
        }
      });
    }
    
    // Si no es paciente, buscar médico
    result = await pool.query(
      `SELECT * FROM medicos WHERE rut = $1 AND LOWER(nombre) = LOWER($2)`,
      [rut, nombre]
    );

    if (result.rows.length > 0) {
      const medico = result.rows[0];

      return res.json({
        message: 'Login exitoso',
        tipo: 'medico',
        medico: {
          id: medico.id,
          rut: medico.rut,
          nombre: medico.nombre,
          email: medico.email,
          especialidad: medico.especialidad,
          id_centro_salud: medico.id_centro_salud
        }
      });
    }

    // Ningún usuario encontrado
    return res.status(404).json({ error: 'Usuario no encontrado' });

  } catch (error) {
    console.error('❌ Error en loginPersona:', error);
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
