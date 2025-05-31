const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta para registrar
router.post('/registrar', usuarioController.registrar);

// Ruta para login
router.post('/login', usuarioController.login);

module.exports = router;