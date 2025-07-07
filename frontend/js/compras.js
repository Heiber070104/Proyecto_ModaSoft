
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

const cargarCompras = async () => {

    try {
        const contenedor = document.querySelector(".cont-compras");
        contenedor.innerHTML = "";

        const res = await fetch("http://localhost:8000/compras", {
            method: "GET"
        });

        if (res.ok) {

            const consulta = await res.json();

            Object.values(consulta).forEach(compra => {

                let html = "";

                const nuevaFila = document.createElement("tr");
                nuevaFila.classList = "fila";

                let col = "🔒 Compra cerrada";
                let estado;

                switch (compra.estado) {
                    case "pendiente":
                        estado = "⏳ Pendiente";
                        col = `
                            <button onclick='completarCompra(${compra.id_compra})'>✅ Completar orden</button>
                            <button onclick='cancelarCompra(${compra.id_compra})'>❌ Cancelar orden</button>
                        `;
                        break;
                    case "procesada":
                        estado = "✅ Completada";
                        break;
                    case "cancelada":
                        estado = "❌ Cancelada";
                        break;
                }

                html += `
                    <td>${compra.id_compra}</td>
                    <td>${compra.fecha_creada}</td>
                    <td>${compra.fecha_vence}</td>
                    <td>${compra.proveedor["nombre"]}</td>
                    <td>${compra.total}</td>
                    <td>${estado}</td>
                    <td>
                        <a href="http://localhost:8000/compras/pdf/${compra.id_compra}" target="_blank" class="btn btn-danger"><button>📄 Detalles de compra</button></a>
                    </td>
                    <td class="rol">${col}</td>
                `;

                nuevaFila.innerHTML = html;
                contenedor.appendChild(nuevaFila);
            });

            new loaderComponent().stopLoading();
            cargarRol();    

        } else {
            console.log(await res.json());
        }

    } catch (e) {
        console.log(e);
    }

}

const cancelarCompra = async id => {

    const confirm = await Swal.fire({
        title: "¿Seguro quieres cancelar esta compra?",
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


    try {
        const res = await fetch(`http://localhost:8000/compras/cancelar/${id}`, {
            method: "GET"
        });

        const consulta = await res.json();

        if (res.ok) {
            Swal.fire({
                title: "Exito",
                text: consulta.message,
                icon: "success"
            });
            cargarCompras();
        } else {
            Swal.fire({
                title: "Error",
                text: consulta.message,
                icon: "warning"
            });
            console.log(consulta.message)
        }
    } catch (e) {
        Swal.fire({
            title: "Error",
            text: e,
            icon: "warning"
        });
        console.log(e);
    }
}

const completarCompra = async id => {

    const confirm = await Swal.fire({
        title: "¿Seguro quieres completar esta compra?",
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

    try {
        const res = await fetch(`http://localhost:8000/compras/completar/${id}`, {
            method: "GET"
        });

        const consulta = await res.json();

        if (res.ok) {
            await Swal.fire({
                title: "Exito",
                text: consulta.message,
                icon: "success"
            });
            cargarCompras();
        } else {
            Swal.fire({
                title: "Error",
                text: consulta.message,
                icon: "warning"
            });
            console.log(consulta.message)
        }
    } catch (e) {
        Swal.fire({
            title: "Error",
            text: e,
            icon: "warning"
        });
        console.log(e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCompras()
    cargarRol();
});