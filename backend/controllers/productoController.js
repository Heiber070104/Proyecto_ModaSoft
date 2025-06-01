const productoModel = require('../models/productoModel');

exports.consultaProductos = async (req, res) => {

    try{
       
        if(!req.query.id){
            condicion = 1
        }else{
            const id = req.query.id;
            condicion = `P.id_producto = ${id}`
        }

        const consulta = await productoModel.obtenerProductos(condicion)

        if(consulta == ""){
            return res.status(404).json({mansaje: "Producto no encotrado"});
        }
        return res.status(201).json({mansaje: "Consulta exitosa", datos: consulta});

    }catch(error){
        
        console.error("Error en la consulta: ", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }

}

exports.consultaCategorias = async (req, res) => {
    try{
        const consulta = await productoModel.obtenerCategorias()
        return res.status(201).json({mansaje: "Consulta exitosa", datos: consulta});
    }catch(error){
        console.error("Error en la consulta: ", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.consultaTallas = async (req, res) => {
    try{
        const consulta = await productoModel.obtenerTallas()
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

        const {nombre, descripcion, precio_unitario, id_categoria, id_talla, cantidad} = req.body;
        if(!nombre || !descripcion || !precio_unitario || !id_categoria || !id_talla || !cantidad){
            return res.status(400).json({mensaje: "Campos vacios"})
        }

        await productoModel.agregar(nombre, descripcion, precio_unitario, id_categoria, id_talla, cantidad);
        return res.status(200).json({mansaje: "Producto agregado a la base de datos"})

    }catch(error){

        console.error("Error en la consulta: ", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.actualizar = async (req, res) => {

    try {

        const {id, nombre, descripcion, precio_unitario, id_categoria, id_talla, cantidad} = req.body;
        if(!id || !nombre || !descripcion || !precio_unitario || !id_categoria || !id_talla || !cantidad){
            return res.status(400).json({mensaje: "Campos vacios"})
        }   

        await productoModel.actualizar(id, nombre, descripcion, precio_unitario, id_categoria, id_talla, cantidad);
        return res.status(200).json({mansaje: "Producto actualizado en la base de datos"});

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            mensaje: error.message
        });
    }

}

exports.eliminar = async (req, res) => {

    try {

        const id = req.query.id;
        if(!id){
            return res.status(400).json({success: false, mensaje: "Parámetro ID requerido"})
        }

        const respuesta = await productoModel.eliminar(id);

        if(respuesta === 0){return res.status(404).json({success: false, mensaje: "ID inexistente en la base de datos"})}
        return res.status(200).json({success: true, mensaje: "Producto elimindo de la base de datos"})

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            mensaje: error.message
        });
    }
}