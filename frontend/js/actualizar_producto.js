const params = new URLSearchParams(window.location.search);
var id = params.get("id");

document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const porcentaje = document.getElementById("porcentaje").value;

    if(!id || !nombre || !descripcion || !precio || !porcentaje){
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
                porcentaje: porcentaje
            })
        })

        const consulta = await res.json(); 

        if(res.ok){
            alert(consulta.message)
            window.location.href = "inventario.html"
        }else{
            console.log("Error al actualizar el producto: " + consulta.message);
            alert("Error al actulizar el producto, intente nuevamente" + consulta.message);  
        }

    }catch(error){
        console.log(error)
        alert("Error al actualizar el producto, intente nuevamente" + error);
    }
})

// const cargarSelect = async (direccion) => {

//     try{

//        const res = await fetch(`http://localhost:8000/${direccion}`, {
//             method: "GET"
//        })

//        const consulta = await res.json();

//        if(res.ok){
// ;
//             let html = "";

//             Object.values(consulta).forEach(datos => {

//                 let arrayDatos = Object.values(datos);

               

//                 html += `
//                     <option value="${arrayDatos[0]}">
//                         ${arrayDatos[1]}
//                     </option>
//                 `
//             })

//             document.getElementById(direccion).innerHTML = html;

//        }

//     }catch(error){
//         console.log(error);
//     }
// }

document.addEventListener("DOMContentLoaded", async () => {

    try {
         
        const res = await fetch(`http://localhost:8000/productos/${id}`)
        const consulta = await res.json()

        console.log(consulta)

        if(res.ok){

            document.getElementById("nombre").value = consulta.nombre;
            document.getElementById("descripcion").value = consulta.descripcion;
            document.getElementById("precio").value = consulta.precio_unitario;
            document.getElementById("porcentaje").value = consulta.porcentaje_ganancia;
            // document.getElementById("categorias").value = consulta.id_categoria;
            // document.getElementById("tallas").value = consulta.id_talla;
            // document.getElementById("cantidad").value = consulta.cantidad;

        }
            
    }catch(error){
        console.log(error)
    }

})