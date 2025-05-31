const productoModel = require('../models/productoModel');

exports.consultaProductos = async (req, res) => {

    try{
       
        const consulta = await productoModel.obtenerProductos()
        return res.status(201).json({mansaje: "Consulta exitosa", datos: consulta});

    }catch(error){
        
        console.error("Error en la consulta: ", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }

}

exports.agregar = async (req, res) => {

    try{

        const {nombre, descripcion, precio_unitario, id_categoria, id_talla} = req.body;

        if(!nombre, !descripcion, !precio_unitario, !id_categoria, !id_talla){
            return res.status(400).json({mensaje: "Campos vacios"})
        }

        await productoModel.agregar(nombre, descripcion, precio_unitario, id_categoria, id_talla);
        return res.status(200).json({mansaje: "Producto agregado a la base de datos"})

    }catch(error){

        console.error("Error en la consulta: ", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}