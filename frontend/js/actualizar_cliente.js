document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    var id = params.get("id");

    try {
         
        const res = await fetch(`http://localhost:8000/clientes/${id}`)
        const consulta = await res.json()

        console.log(consulta)

        if(res.ok){

            document.getElementById("nombre").value = consulta.nombre;
            document.getElementById("cedula").value = consulta.cedula;
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

        const nombre = document.getElementById("nombre").value;
        const cedula = document.getElementById("cedula").value;
        const direccion = document.getElementById("direccion").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("correo").value;

        if(!nombre || !cedula || !direccion || !telefono || !correo){
            Swal.fire("Rellene todos los campos");
            return false;
        }

        try{

            const res = await fetch(`http://localhost:8000/clientes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    cedula:cedula,
                    direccion: direccion,
                    telefono: telefono,
                    correo: correo
                })
            })

            const consulta = await res.json();

            if(res.ok){
            
                await Swal.fire({
                    title: "Éxito",
                    text: consulta.message,
                    icon: "success"
                });
                window.location.href = "clientes.html"

            }else{
                console.log("Error al actualizar el cliente: " + consulta.message);
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