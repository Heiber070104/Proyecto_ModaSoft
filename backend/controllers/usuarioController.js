const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

exports.registrar = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    const existente = await usuarioModel.buscarPorCorreo(correo);
    if (existente) return res.status(400).json({ error: 'Correo ya registrado' });

    const id_usuario = await usuarioModel.registrarUsuario(nombre, correo, contraseña);
    await usuarioModel.registrarLogin(id_usuario, correo, await bcrypt.hash(contraseña, 10));

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en registrar:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    const datos = await usuarioModel.obtenerLoginPorUsuario(usuario);

    if (!datos) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(contraseña, datos.hash_password);
    if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    await usuarioModel.actualizarFechaAcceso(datos.id_login);

    res.json({
      mensaje: 'Login exitoso',
      usuario: datos.usuario,
      rol: datos.rol,
      nombre: datos.nombre
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
};
