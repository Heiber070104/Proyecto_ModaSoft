const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',          
  password: '',          
  database: 'modasoft',   
  waitForConnections: true,
});

// connection.connect((err) => {
//   if (err) {
//     console.error('Error al conectar a MySQL:', err);
//   } else {
//     console.log('Conectado a la base de datos MySQL');
//   }
// });

module.exports = connection;
