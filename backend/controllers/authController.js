const bcrypt = require('bcrypt');
const db = require('../config/db');

// Registrar nuevo usuario
exports.registerUser = async (req, res) => {
  const { nombre, correo, rol, contraseña, usuario } = req.body;

  if (!nombre || !correo || !rol || !contraseña || !usuario) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    // Hashear contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    // Insertar en tabla usuario
    const usuarioSql = 'INSERT INTO usuario (nombre, correo, rol, contraseña, estado) VALUES (?, ?, ?, ?, 1)';
    db.query(usuarioSql, [nombre, correo, rol, hash], (err, result) => {
      if (err) {
        console.error('Error al insertar en usuario:', err);
        return res.status(500).json({ message: 'Error en registro de usuario' });
      }

      const id_usuario = result.insertId;

      // Insertar en tabla login
      const loginSql = 'INSERT INTO login (id_usuario, usuario, hash_password, fecha_ultimo_acceso) VALUES (?, ?, ?, NOW())';
      db.query(loginSql, [id_usuario, usuario, hash], (err2) => {
        if (err2) {
          console.error('Error al insertar en login:', err2);
          return res.status(500).json({ message: 'Error en registro de login' });
        }

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
      });
    });
  } catch (error) {
    console.error('Error general:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Iniciar sesión
exports.loginUser = (req, res) => {
  const { usuario, contraseña } = req.body;
  if (!usuario || !contraseña) {
    return res.status(400).json({ message: 'Campos requeridos' });
  }

  // Buscar por usuario y unir con tabla usuario para obtener nombre
  const sql = `
    SELECT l.hash_password, u.nombre 
    FROM login l 
    JOIN usuario u ON l.id_usuario = u.id_usuario 
    WHERE l.usuario = ?
  `;

  db.query(sql, [usuario], async (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ message: 'Error al iniciar sesión' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const { hash_password, nombre } = results[0];

    try {
      const match = await bcrypt.compare(contraseña, hash_password);
      if (match) {
        return res.status(200).json({ message: 'Login exitoso', nombre });
      } else {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
    } catch (error) {
      console.error('Error al comparar contraseñas:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  });
};
