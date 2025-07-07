const cargarRol = () => {

    const sesion = new Sesiones().obtenerSesion();

    if(!sesion || !sesion.rol || !sesion.rol) {
        alert("No tiene autorización.");
        sesion.cerrarSesion();
        window.location.href = "../pages/login.html";
    }

    switch(sesion.rol){
        
        case "Comprador":
            alert("Los compradores no tienen autorización para acceder a esta página.");
            window.location.href = "../pages/dashboard.html";  
        break;
        case "Gerente":
        case "Contador":
            const ocultar = document.querySelectorAll(".rol");
            ocultar.forEach(element => {
                element.style.display = "none";
            })
        break;
    }
        

}

const cargarVentas = async () => {

    try{

        const res = await fetch("http://localhost:8000/ventas", {
            method: "GET"
        })

        const consulta = await res.json();

        console.log(consulta)

        if(res.ok){

            const contenedor = document.querySelector(".cont-ventas");
            contenedor.innerHTML = "";

            Object.values(consulta).forEach(venta => {

                let html = "";

                const nuevaFila = document.createElement("tr")
                nuevaFila.classList = "fila"

                let col = "🔒 Venta cerrada"
                let estado;

                switch(venta.estado){
                    case "en_proceso":
                        estado = "⌚ En proceso"
                         col = `
                            <button onclick='completarVenta(${venta.id_venta})' class="rol">✅ Completar venta</button>
                            <button onclick='cancelarVenta(${venta.id_venta})' class="rol">❌ Cancelar venta</button>
                        ` 
                    break;
                    case "completada":
                        estado = "💲 Completada"
                    break;
                    case "cancelada":
                        estado = "💸 Cancelada"
                    break
                }

                html += `
                        <td>${venta.id_venta}</td>
                        <td>${venta.factura}</td>
                        <td>${venta.fecha}</td>
                        <td>${venta.cliente["nombre"]}</td>
                        <td>${venta.total}</td>
                        <td>${estado}</td>
                        <td>
                            <a href="http://localhost:8000/ventas/pdf/${venta.id_venta}" target="_blank" class="btn btn-danger"><button>📄 Detalles de venta</button></a>
                        </td>
                        <td class="rol">${col}</td>
                `

                nuevaFila.innerHTML = html;
                contenedor.appendChild(nuevaFila)
        
            })

            new loaderComponent().stopLoading();
            cargarRol();

        }else{
            console.log(consulta.message)
        }

    }catch(e){
            console.log(e)
    }
}

const completarVenta = async id => {

    const confirm = await Swal.fire({
        title: "¿Seguro quieres completar esta venta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "Cancelar"
    })
    if (!confirm.isConfirmed) {
        return;
    }

        try{

            const res = await fetch(`http://localhost:8000/ventas/completar/${id}`, {
                method: "GET"
            })

            const consulta = await res.json();

            if(res.ok){
                Swal.fire({
                    title: "Exito",
                    text: consulta.message,
                    icon: "success"
                });
                cargarVentas();
            }else{
                Swal.fire({
                    title: "Error",
                    text: consulta.message,
                    icon: "warning"
                });
                console.log(consulta.message)
            }
        }catch(e){
            Swal.fire({
                title: "Error",
                text: e,
                icon: "warning"
            });
            console.log(e)
        }

}

const cancelarVenta = async id => {

    const confirm = await Swal.fire({
        title: "¿Seguro quieres cancelar esta venta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "Cancelar"
    })
    if (!confirm.isConfirmed) {
        return;
    }


        try{

            const res = await fetch(`http://localhost:8000/ventas/cancelar/${id}`, {
                method: "GET"
            })

            const consulta = await res.json();

            if(res.ok){
                Swal.fire({
                    title: "Exito",
                    text: consulta.message,
                    icon: "success"
                });
                cargarVentas();
            }else{
                Swal.fire({
                    title: "Error",
                    text: consulta.message,
                    icon: "warning"
                });
                console.log(consulta.message);
            }
        }catch(e){
            Swal.fire({
                title: "Error",
                text: e,
                icon: "warning"
            });
            console.log(e)
        }

}

document.addEventListener('DOMContentLoaded', () => {
    cargarRol()
    cargarVentas() 
});
