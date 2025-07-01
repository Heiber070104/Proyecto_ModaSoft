document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("formulario").addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const cedula = document.getElementById("cedula").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;

    if(!nombre || !cedula || !direccion || !telefono || !correo){
        alert("Rellene todos los campos");
        return false;
    }

    try{

        const res = await fetch("http://localhost:8000/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                cedula: cedula,
                direccion: direccion,
                telefono: telefono,
                correo: correo
            })
        })

        const consulta = await res.json();

        if(res.ok){
            
            alert(consulta.message)

            document.getElementById("nombre").value = "";
            document.getElementById("cedula").value = "";
            document.getElementById("direccion").value = "";
            document.getElementById("telefono").value = "";
            document.getElementById("correo").value = "";

        }else{
            console.log("Error al registrar el cliente: " + consulta.message);
            alert("Error al registrar el cliente, intente nuevamente" + consulta.message);  
        }

    }catch(error){
        console.log(error)
        alert("Error al registrar el cliente, intente nuevamente" + consulta.message); 
    }

    })      

})