const params = new URLSearchParams(window.location.search);
var id = params.get("id");

document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const id_categoria = document.getElementById("categoria").value;
    const id_talla = document.getElementById("talla").value;
    const cantidad = document.getElementById("cantidad").value;

    if(!id || !nombre || !descripcion || !precio || !id_categoria || !id_talla || !cantidad){
        alert("Rellene todos los campos");
        return false;
    }

    try {
        
        const res = await fetch("http://localhost:3000/api/productos/actualizarProducto",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                nombre: nombre,
                descripcion: descripcion,
                precio_unitario: precio,
                id_categoria: id_categoria,
                id_talla: id_talla,
                cantidad: cantidad
            })
        })

        if(res.ok){
            alert("Producto actualizado")
            window.location.href = "../../pages/inventario.html"
        }

    }catch(error){
        console.log
    }
})

const cargarSelect = async (select,direccion) => {

    try{

       const res = await fetch(`http://localhost:3000/api/productos/${direccion}`, {
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }
       })

       const consulta = await res.json();

       if(res.ok){

            let datos = consulta.datos;
            let html = "";

            Object.values(datos).forEach(dato => {

                let arrayDatos = Object.values(dato);

                html += `
                    <option value="${arrayDatos[0]}">
                        ${arrayDatos[1]}
                    </option>
                `
            })

            document.getElementById(select).innerHTML = html;

       }

    }catch(error){
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    await cargarSelect("categoria","consultaCategorias"); 
    await cargarSelect("talla","consultaTallas");

    try {
         
        const res = await fetch(`http://localhost:3000/api/productos/consultaProductos?id=${id}`)
        const consulta = await res.json()

        if(res.ok){

            const datos = consulta.datos;
            Object.values(datos).forEach(producto => {

                document.getElementById("nombre").value = producto.nombre;
                document.getElementById("descripcion").value = producto.descripcion;
                document.getElementById("precio").value = producto.precio_unitario;
                document.getElementById("categoria").value = producto.id_categoria;
                document.getElementById("talla").value = producto.id_talla;
                document.getElementById("cantidad").value = producto.cantidad;

            })
        }
            
    }catch(error){
        console.log(error)
    }

})