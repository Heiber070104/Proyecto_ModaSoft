const db = require('../config/db');
const bcrypt = require('bcrypt');

// Registrar usuario nuevo
exports.registrarUsuario = async (nombre, correo, contraseña) => {
  const hash = await bcrypt.hash(contraseña, 10);
  const [result] = await db.execute(
    'INSERT INTO modasoft.usuario (nombre, correo, rol, contraseña, estado) VALUES (?, ?, "vendedor", ?, 1)',
    [nombre, correo, hash]
  );
  return result.insertId;
};

// Buscar usuario por correo
exports.buscarPorCorreo = async (correo) => {
  const [rows] = await db.execute(
    'SELECT * FROM modasoft.usuario WHERE correo = ? AND estado = 1',
    [correo]
  );
  return rows[0];
};

// Registrar en tabla login
exports.registrarLogin = async (id_usuario, usuario, hash_password) => {
  const [result] = await db.execute(
    'INSERT INTO modasoft.login (id_usuario, usuario, hash_password, fecha_ultimo_acceso) VALUES (?, ?, ?, NOW())',
    [id_usuario, usuario, hash_password]
  );
  return result.insertId;
};

// Validar login
exports.obtenerLoginPorUsuario = async (usuario) => {
  const [rows] = await db.execute(
    'SELECT l.*, u.nombre, u.rol FROM modasoft.login l INNER JOIN modasoft.usuario u ON l.id_usuario = u.id_usuario WHERE l.usuario = ?',
    [usuario]
  );
  return rows[0];
};

// Actualizar último acceso
exports.actualizarFechaAcceso = async (id_login) => {
  await db.execute(
    'UPDATE modasoft.login SET fecha_ultimo_acceso = NOW() WHERE id_login = ?',
    [id_login]
  );
};
