document.getElementById("formulario").addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const id_categoria = document.getElementById("categoria").value;
    const id_talla = document.getElementById("talla").value;
    const cantidad = document.getElementById("cantidad").value;

    if(!nombre || !descripcion || !precio || !id_categoria || !id_talla || !cantidad){
        alert("Rellene todos los campos");
        return false;
    }

    try{

        const res = await fetch("http://localhost:8000/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
            alert("Producto registrado con éxito")
            document.getElementById("nombre").value = "";
            document.getElementById("descripcion").value = "";
            document.getElementById("precio").value = 0;
            document.getElementById("categoria").value = 1;
            document.getElementById("talla").value = 1;
            document.getElementById("cantidad").value = 0;
        }else{
            console.log("Error al registrar el producto: " + res.message);
            alert("Error al registrar el producto, intente nuevamente" + res.message);  
        }

    }catch(error){
        console.log(error)
        alert("Error al registrar el producto, intente nuevamente" + res.message); 
    }

})

const cargarSelect = async (direccion) => {

    try{

       const res = await fetch(`http://localhost:8000/productos/${direccion}`, {
            method: "GET",
       })

       const consulta = await res.json();

       if(res.ok){

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

document.addEventListener('DOMContentLoaded', () => {
    cargarSelect("categoria"); 
    cargarSelect("talla");
})