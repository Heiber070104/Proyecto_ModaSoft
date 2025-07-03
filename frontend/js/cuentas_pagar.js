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
                    <td>${deuda.fecha_vencimiento}</td>
                    <td>${deuda.monto_total}</td>
                    <td>${deuda.monto_pagado}</td>
                    <td>${estado}</td>
                    <td>${col}</td>
                `

                fila.innerHTML = html;
                contenedor.appendChild(fila);

            })

        }else{
            consulta.log(consulta.message);
        }

    }catch(e){
        console.error("Error al cargar el script de cuentas por pagar:", e);
    }

}

document.addEventListener("DOMContentLoaded", cargarDeudas)