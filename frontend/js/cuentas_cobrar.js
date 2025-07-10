const cargarRol = () => {

    const sesion = new Sesiones().obtenerSesion();

    if(!sesion || !sesion.rol || !sesion.rol) {
        alert("No tiene autorización.");
        sesion.cerrarSesion();
        window.location.href = "../pages/login.html";
    }

    switch(sesion.rol){
        
        case "Comprador":

            alert("Los Compradores no tienen autorización para acceder a esta página.");
            window.location.href = "../pages/dashboard.html";
            
        break;
        case "Gerente":
        case "Contador":

            const ocultar = document.querySelectorAll(".rol");
            // console.log(ocultar)
            ocultar.forEach(element => {
                element.style.display = "none";
            })

        break;
    }
        

}

const cargarCuentas = async () => {

    try{

        const contenedor = document.querySelector(".cont-cuentas")

        const res = await fetch("http://localhost:8000/ventas/cobrar");
        const consulta = await res.json();

        console.log(consulta)

        if(res.ok){

            Object.values(consulta).forEach(cuenta => {

                    const fila = document.createElement("tr");
                    fila.classList = "fila";
                    let html = "";

                let estado = "✅ Pagado"
                let col = "🔒 Deuda cerrada"
                if(cuenta.estado == "pendiente"){
                    col = `<a href='cobrar_cuenta.html?id=${cuenta.id_cuenta_cobrar}'><button>💹 Registrar pago</button></a>`
                    estado = "❗ Pendiente"
                }

                html += `
                    <td>${cuenta.id_venta}</td>
                    <td>${cuenta.venta["cliente"]["nombre"]}</td>
                    <td>${cuenta.fecha}</td>
                    <td>${cuenta.monto_total}</td>
                    <td>${cuenta.monto_pagado}</td>
                    <td>${estado}</td>
                    <td class="rol">${col}</td>
                `

                fila.innerHTML = html;
                contenedor.appendChild(fila);

            })

            new loaderComponent().stopLoading();
            cargarRol();

        }else{
            consulta.log(consulta.message);
        }

    }catch(e){
        console.error("Error al cargar el script de cuentas por cobrar:", e);
    }

}

document.addEventListener("DOMContentLoaded", () => {cargarRol(); cargarCuentas()})