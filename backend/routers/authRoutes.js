const express = require('express'); 
const router = express.Router();
const {consultaProductos} = require('../controllers/productoController')
const { registerUser, loginUser } = require('../controllers/authController');

// Ruta de prueba
router.get('/ping', (req, res) => {
  res.send('Ruta de autenticación funcionando');
});

// Rutas limpias
// router.get("/consultaProductos", consultaProductos)
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
