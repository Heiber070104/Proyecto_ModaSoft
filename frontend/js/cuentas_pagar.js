
const cargarRol = () => {

    const sesion = new Sesiones().obtenerSesion();

    if(!sesion || !sesion.rol || !sesion.rol) {
        alert("No tiene autorización.");
        sesion.cerrarSesion();
        window.location.href = "../pages/login.html";
    }

    switch(sesion.rol){
        
        case "Vendedor":

            alert("Los vendedores no tienen autorización para acceder a esta página.");
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

const cargarDeudas = async () => {

    try{

        const contenedor = document.querySelector(".cont-deudas")

        const res = await fetch("http://localhost:8000/compras/deudas");
        const consulta = await res.json();

        console.log(consulta)

        if(res.ok){

            Object.values(consulta).forEach(deuda => {

                    const fila = document.createElement("tr");
                    fila.classList = "fila";
                    let html = "";

                let estado = "✅ Pagado"
                let col = "🔒 Deuda cerrada"
                if(deuda.estado == "pendiente"){
                    col = `<a href='pagar_deuda.html?id=${deuda.id_cuenta_pagar}'><button>💸 Abonar</button></a>`
                    estado = "❗ Pendiente"
                }

                html += `
                    <td>${deuda.id_compra}</td>
                    <td>${deuda.compra["proveedor"]["nombre"]}</td>
                    <td>${deuda.fecha}</td>
                    <td>${deuda.monto_total}</td>
                    <td>${deuda.monto_pagado}</td>
                    <td>${estado}</td>
                    <td class="rol">${col}</td>
                `

                fila.innerHTML = html;
                contenedor.appendChild(fila);

            })

            new loaderComponent().stopLoading();
            cargarRol();

        }else{
            console.log(consulta.message);
        }

    }catch(e){
        console.error("Error al cargar el script de cuentas por pagar:", e);
    }

}

document.addEventListener("DOMContentLoaded", () => {cargarRol(); cargarDeudas()})

