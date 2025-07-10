
const completarVenta = async (id, metodo) => {

    if(metodo === "CONTADO"){

        const confirmacion = await Swal.fire({
            title: 'Venta pagada a: ',
            input: 'select',
            inputOptions: {
                'Formas de pago': {
                    'EFECTIVO': 'Efectivo 💸',
                    'BANCARIO': 'Bancario (tranferencia/cheque) 📃',
                },
   
            },
            inputPlaceholder: 'Selecciona...',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return '¡Debes seleccionar una opción!';
                }
            }
        })
        if(confirmacion.isDismissed){
            return;
        }

        var metodo_pago = confirmacion.value;
        
    }else{
        const confirmacion = await Swal.fire({
            title: '¿Seguro quieres completar la compra?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, completar compra',
            cancelButtonText: 'Cancelar'
        })

        if (!confirmacion.isConfirmed) {
            return;
        }

    }

        try{

            const res = await fetch(`http://localhost:8000/ventas/completar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },body: JSON.stringify({
                    metodo_pago: metodo_pago
                })
            });
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
    
    const renderizarVentas = (consulta) => {
        const contenedor = document.querySelector(".cont-ventas");
        contenedor.innerHTML = "";

        Object.values(consulta).forEach(venta => {
            const fila = document.createElement("tr");
            let acciones = "🔒 Venta cerrada";
            let estadoTexto;

            switch (venta.estado) {
                case "en_proceso":
                    estadoTexto = "⌚ En proceso";
                    acciones = `
                        <button onclick='completarVenta(${venta.id_venta}, "${venta.tipo_pago}")'>✅ Completar</button>
                        <button onclick='cancelarVenta(${venta.id_venta})'>❌ Cancelar</button>
                    `;

                    break;
                case "completada":
                    estadoTexto = "💲 Completada";
                    break;
                case "cancelada":
                    estadoTexto = "💸 Cancelada";
                    break;

            }

            fila.innerHTML = `
                <td>${venta.id_venta}</td>
                <td>${venta.factura}</td>
                <td>${venta.fecha}</td>
                <td>${venta.cliente.nombre}</td>
                <td>${venta.total}</td>
                <td>${venta.tipo_pago}</td>
                <td>${estadoTexto}</td>
                <td>
                    <a href="http://localhost:8000/ventas/pdf/${venta.id_venta}" target="_blank">
                        <button>📄 Ver</button>
                    </a>
                </td>
                <td>${acciones}</td>
            `;
            contenedor.appendChild(fila);
        });
        new loaderComponent().stopLoading();
    };

    const cargarVentas = async () => {
        try {
            const res = await fetch("http://localhost:8000/ventas");
            const data = await res.json();
            if (res.ok) renderizarVentas(data);
        } catch (err) {
            console.error(err);
        }
    };

document.addEventListener("DOMContentLoaded", () => {
    const tipoBusqueda = document.getElementById("tipoBusqueda");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const inputsDinamicos = document.getElementById("inputsDinamicos");

const cargarRol = () => {

    const sesion = new Sesiones().obtenerSesion();

    if(!sesion || !sesion.rol || !sesion.usuario) {
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


    

   

    tipoBusqueda.addEventListener("change", function () {
        inputsDinamicos.innerHTML = "";

        switch (this.value) {
            case "fecha":
                inputsDinamicos.innerHTML = `
                    <label>Desde:</label>
                    <input type="date" id="fechaInicio">
                    <label>Hasta:</label>
                    <input type="date" id="fechaFin">
                `;
                break;
            case "estado":
                inputsDinamicos.innerHTML = `
                    <label>Estado:</label>
                    <select id="estado">
                        <option value="en_proceso">En proceso</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                `;
                break;
            case "cliente":
                inputsDinamicos.innerHTML = `
                    <label>Cliente:</label>
                    <input type="text" id="clienteNombre" placeholder="Ej: Ana López">
                `;
                break;
        }
    });

    btnBuscar.addEventListener("click", async () => {
        const tipo = tipoBusqueda.value;
        if (!tipo) return alert("Seleccione un tipo de búsqueda");

        let url = `http://localhost:8000/ventas/filtrar?tipo=${tipo}`;

        switch (tipo) {
            case "fecha":
                const inicio = document.getElementById("fechaInicio").value;
                const fin = document.getElementById("fechaFin").value;
                if (!inicio || !fin) return alert("Debe seleccionar ambas fechas");
                url += `&inicio=${inicio}&fin=${fin}`;
                break;
            case "estado":
                const estado = document.getElementById("estado").value;
                url += `&estado=${estado}`;
                break;
            case "cliente":
                const cliente = document.getElementById("clienteNombre").value.trim();
                if (!cliente) return alert("Debe ingresar el nombre del cliente");
                url += `&cliente=${encodeURIComponent(cliente)}`;
                break;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                renderizarVentas(data);
            } else {
                alert(data.message || "No se encontraron resultados");
            }
        } catch (e) {
            console.error(e);

        }
    });

    btnLimpiar.addEventListener("click", () => {
        cargarVentas();
        tipoBusqueda.value = "";
        inputsDinamicos.innerHTML = "";
    });


        cargarRol()
        cargarVentas() 

    
})
