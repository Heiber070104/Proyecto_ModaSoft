document.getElementById("formulario").addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const porcentaje = document.getElementById("porcentaje").value;
    const id_categoria = document.getElementById("categorias").value;
    const id_talla = document.getElementById("tallas").value;
    const id_proveedor = document.getElementById("proveedores").value;


    if(!nombre || !descripcion || !precio || !porcentaje || id_categoria == "!" || id_talla == "!" || id_proveedor == "!")
    {
        Swal.fire("Rellene todos los campos");
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
                porcentaje: porcentaje,
                id_categoria: id_categoria,
                id_talla: id_talla,
                id_proveedor: id_proveedor
            })
        })

        const consulta = await res.json();

        if(res.ok){
            await Swal.fire({
                title: "Exito",
                text: consulta.message,
                icon: "success"
            });
            window.location.href = "inventario.html";
        }else{
            console.log("Error al registrar el producto: " + consulta.message);
            Swal.fire({
                title: "Error",
                text: consulta.message,
                icon: "warning"
            });  
        }

    }catch(error){
        Swal.fire({
            title: "Error",
            text: error,
            icon: "warning"
        });
        alert("Error al registrar el producto, intente nuevamente" + error); 
    }

})

document.getElementById("categorias").addEventListener("change", () => {

    const id = document.getElementById("categorias").value;
    const select = document.getElementById("tallas");

    select.selectedIndex = "!";

    select.querySelectorAll("option").forEach(option => {
        if(option.dataset.cat != id){
            option.hidden = true;
        }else{
            option.hidden = false
        }
    })
   
})


const cargarSelect = async (direccion) => {

    try{

       const res = await fetch(`http://localhost:8000/${direccion}`, {
            method: "GET",
       })

       const consulta = await res.json();

       if(res.ok){

            let html = `<option value='!' hidden selected>Seleccione ${direccion}</option>`;

            Object.values(consulta).forEach(datos => {

                let arrayDatos = Object.values(datos);

                let cat = ""
                let indice = 1
                if(Number.isInteger(arrayDatos[1])){
                    cat = `data-cat='${arrayDatos[1]}' hidden`
                    indice = 2;
                }

                html += `
                    <option value="${arrayDatos[0]}" ${cat}>
                        ${arrayDatos[indice]}
                    </option>
                `
            })

            document.getElementById(direccion).innerHTML = html;

       }

    }catch(error){
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await cargarSelect("categorias"); 
    await cargarSelect("tallas");
    await cargarSelect("proveedores");

    const params = new URLSearchParams(window.location.search);
    if(params.get("id")){
        const id = params.get("id");
       
        try{

            const res = await fetch(`http://localhost:8000/productos/${id}`, {
                method: "GET"
            });

            const consulta = await res.json();
            
            if(res.ok){

                const select = document.getElementById("tallas");
                const optionDisable = select.querySelector(`option[value="${consulta.id_talla}"]`);
                optionDisable.disabled = true;

                document.getElementById("nombre").value = consulta.nombre;
                document.getElementById("descripcion").value = consulta.descripcion;
                document.getElementById("categorias").value = consulta.id_categoria;
                document.getElementById("proveedores").value = consulta.id_proveedor;

                const cambio = new Event("change")
                document.getElementById("categorias").dispatchEvent(cambio)
                new loaderComponent().stopLoading()
            }else{
                console.log(consulta.message)
            }
        }catch(error){
            console.log(error);
        }
    }else{
        new loaderComponent().stopLoading()
    }

})