const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/consultaProductos', productoController.consultaProductos);
router.post("/nuevoProducto", productoController.agregar)

module.exports = router;