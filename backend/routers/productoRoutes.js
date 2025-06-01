const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/consultaProductos', productoController.consultaProductos);
router.get('/consultaCategorias', productoController.consultaCategorias);
router.get('/consultaTallas', productoController.consultaTallas);

router.post("/nuevoProducto", productoController.agregar)
router.put("/actualizarProducto", productoController.actualizar)
router.delete("/eliminarProducto", productoController.eliminar)

module.exports = router;