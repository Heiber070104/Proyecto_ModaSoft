/*const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas 
const authRoutes = require('./routers/authRoutes');
app.use('/api/auth', authRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('ModaSoft Backend activo');
});

module.exports = app;

*/