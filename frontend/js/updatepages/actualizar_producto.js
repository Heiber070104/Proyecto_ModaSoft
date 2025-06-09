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
        
        const res = await fetch(`http://localhost:8000/productos/${id}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
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

const cargarSelect = async (direccion) => {

    try{

       const res = await fetch(`http://localhost:8000/productos/${direccion}`, {
            method: "GET"
       })

       const consulta = await res.json();

       if(res.ok){
;
            let html = "";

            Object.values(consulta).forEach(datos => {

                let arrayDatos = Object.values(datos);

                html += `
                    <option value="${arrayDatos[0]}">
                        ${arrayDatos[1]}
                    </option>
                `
            })

            document.getElementById(direccion).innerHTML = html;

       }

    }catch(error){
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    await cargarSelect("categoria"); 
    await cargarSelect("talla");

    try {
         
        const res = await fetch(`http://localhost:8000/productos/${id}`)
        const consulta = await res.json()

        console.log(consulta)

        if(res.ok){

            document.getElementById("nombre").value = consulta.nombre;
            document.getElementById("descripcion").value = consulta.descripcion;
            document.getElementById("precio").value = consulta.precio_unitario;
            document.getElementById("categoria").value = consulta.id_categoria;
            document.getElementById("talla").value = consulta.id_talla;
            document.getElementById("cantidad").value = consulta.cantidad;

        }
            
    }catch(error){
        console.log(error)
    }

})