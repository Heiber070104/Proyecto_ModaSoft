const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.obtenerProductos = async () => {
   
    try {
        
        const [resultado] = await db.execute(`
            SELECT P.nombre, P.descripcion, P.precio_unitario, C.nombre AS categoria, T.descripcion AS talla 
            FROM producto P INNER JOIN categoria C ON P.id_categoria = C.id_categoria 
            INNER JOIN talla T ON P.id_talla = T.id_talla    
        `);
        return resultado;

    } catch (error) {
        console.log(error);
    }

}

exports.agregar = async (nombre, descripcion, precio_unitario, id_categoria, id_talla) => {

    try{
        await db.execute("INSERT INTO producto (nombre, descripcion, precio_unitario, id_categoria, id_talla) VALUES (?, ?, ?, ?, ?)",
            [nombre, descripcion, precio_unitario, id_categoria, id_talla]
        )
    }catch(error){
        console.log(error)
    }
}