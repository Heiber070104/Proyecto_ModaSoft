const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.obtenerProductos = async (condicion) => {
   
    try {
        
        const [resultado] = await db.execute(`
            SELECT P.*, C.nombre AS categoria, 
            T.descripcion AS talla, I.cantidad_disponible AS cantidad 
            FROM producto P INNER JOIN categoria C ON P.id_categoria = C.id_categoria 
            INNER JOIN talla T ON P.id_talla = T.id_talla  
            INNER JOIN inventario I ON P.id_producto = I.id_producto WHERE ${condicion}
        `);
        return resultado;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

exports.obtenerCategorias = async () => {
    try {
        const [resultado] = await db.execute(`
            SELECT * FROM categoria    
        `);
        return resultado;
    } catch (error) {
        console.log(error);
    }
}

exports.obtenerTallas = async () => {
    try {
        const [resultado] = await db.execute(`
            SELECT * FROM talla   
        `);
        return resultado;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

exports.agregar = async (nombre, descripcion, precio_unitario, id_categoria, id_talla, cantidad) => {

    try{
        const [resultado] = await db.execute(`
            INSERT INTO producto 
            (nombre, descripcion, precio_unitario, id_categoria, id_talla) 
            VALUES (?, ?, ?, ?, ?)`,
            [nombre, descripcion, precio_unitario, id_categoria, id_talla]
        )

        id = resultado.insertId;
        await db.execute("INSERT INTO inventario (id_producto, cantidad_disponible) VALUES (?, ?)",
            [id, cantidad]
        )

    }catch(error){
        console.log(error)
        throw new Error(error);
    }
}

exports.actualizar = async (id, nombre, descripcion, precio_unitario, id_categoria, id_talla, cantidad) => {

    try {

        await db.execute(`
            UPDATE producto SET nombre = ?,
            descripcion = ?, precio_unitario = ?,
            id_categoria = ?, id_talla = ?
            WHERE id_producto = ?
            `,
            [nombre, descripcion, precio_unitario, id_categoria, id_talla, id]
        )

        await db.execute(`UPDATE inventario SET cantidad_disponible = ? WHERE id_producto = ?`, 
            [cantidad, id]
        ); 

    }catch(error){
        console.log(error);
        throw new Error(error);
    }
}

exports.eliminar = async (id) => {

    try{

        const [resultado] = await db.execute(`DELETE FROM inventario WHERE id_producto = ?`, [id]);
        if(resultado.affectedRows === 0){ return 0; }
        await db.execute(`DELETE FROM producto WHERE id_producto = ?`, [id]);

    }catch(error){
        console.log(error);
        throw new Error(error);
    }

}