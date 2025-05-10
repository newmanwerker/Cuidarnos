const pool = require('../db');
const bcrypt = require('bcrypt');

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('📥 Email recibido:', email);
    console.log('📥 Password recibido:', password);

    // Buscar admin por email
    const result = await pool.query(
      'SELECT * FROM administrador WHERE admin_email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ Admin no encontrado');
      return res.status(404).json({ error: 'Admin no encontrado' });
    }

    const admin = result.rows[0];

    console.log('🔐 Hash en base de datos:', admin.admin_psw);

    // Comparar contraseñas
    const match = await bcrypt.compare(password, admin.admin_psw);
    console.log('🟡 ¿Coincide la contraseña?:', match);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // si todo esta correcto, se puede iniciar sesión
    res.json({
      message: 'Login exitoso',
      admin: {
        id: admin.admin_id,
        nombre: admin.admin_name,
        email: admin.admin_email,
        rol: admin.admin_rol
      }
    });

  } catch (error) {
    console.error('❌ Error del servidor:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};