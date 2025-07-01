document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("formulario").addEventListener("submit", async (e) => {

    e.preventDefault();

    const rif = document.getElementById("rif").value;
    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;

    if(!rif || !nombre || !direccion || !telefono || !correo){
        alert("Rellene todos los campos");
        return false;
    }

    try{

        const res = await fetch("http://localhost:8000/proveedores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
            
            alert(consulta.message)
            window.location.href = "proveedores.html"
            // document.getElementById("nombre").value = "";
            // document.getElementById("direccion").value = "";
            // document.getElementById("telefono").value = "";
            // document.getElementById("correo").value = "";

        }else{
            console.log("Error al registrar el proveedor: " + consulta.message);
            alert("Error al registrar el proveedor, intente nuevamente" + consulta.message);  
        }

    }catch(error){
        console.log(error)
        alert("Error al registrar el proveedor, intente nuevamente" + consulta.message); 
    }

    })      

})
