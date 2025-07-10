document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    var id = params.get("id");

    try {
         
        const res = await fetch(`http://localhost:8000/proveedores/${id}`)
        const consulta = await res.json()

        if(res.ok){

            document.getElementById("rif").value = consulta.rif;
            document.getElementById("nombre").value = consulta.nombre;
            document.getElementById("direccion").value = consulta.direccion;
            document.getElementById("telefono").value = consulta.telefono;
            document.getElementById("correo").value = consulta.correo;
            new loaderComponent().stopLoading();

        }
            
    }catch(error){
        console.log(error)
    }

    document.getElementById("formulario").addEventListener("submit", async (e) => {

        e.preventDefault();

        const rif = document.getElementById("rif").value;
        const nombre = document.getElementById("nombre").value;
        const direccion = document.getElementById("direccion").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("correo").value;

        if(!nombre || !direccion || !telefono || !correo){
            Swal.fire("Rellene todos los campos");
            return false;
        }

        try{

            const res = await fetch(`http://localhost:8000/proveedores/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    rif: rif,
                    nombre: nombre,
                    direccion: direccion,
                    telefono: telefono,
                    correo: correo
                })
            })

            const consulta = await res.json();

            if(res.ok){
            
                await Swal.fire({
                    title: "Exito",
                    text: consulta.message,
                    icon: "success"
                });
                window.location.href = "proveedores.html"

            }else{
                console.log("Error al actualizar el producto: " + consulta.message);
                Swal.fire({
                    title: "Error",
                    text: consulta.message,
                    icon: "warning"
                });
            }

        }catch(error){
            console.log(error)
            Swal.fire({
                title: "Error",
                text: error,
                icon: "warning"
            });
        }

    })    

})