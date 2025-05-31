const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas 
const authRoutes = require('./routers/authRoutes');
app.use('/api/auth', authRoutes);

const productos = require('./routers/productoRoutes');
app.use('/api/productos', productos);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('ModaSoft Backend activo');
});

// Puerto
const PORT = process.env.PORT || 3000;

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
