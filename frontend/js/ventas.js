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
            fila.classList = "fila"
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
                <td class="factura">${venta.factura}</td>
                <td class="fecha">${venta.fecha}</td>
                <td class="nombre">${venta.cliente.nombre}</td>
                <td>${venta.total}</td>
                <td class="tipoPago">${venta.tipo_pago}</td>
                <td class="estado">${estadoTexto}</td>
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
                        <option value="En proceso">En proceso</option>
                        <option value="Completada">Completada</option>
                        <option value="Cancelada">Cancelada</option>
                    </select>
                `;
                break;
            case "cliente":
                inputsDinamicos.innerHTML = `
                    <label>Cliente:</label>
                    <input type="text" id="clienteNombre" placeholder="Ej: Ana López">
                `;
                break;
            case "factura":
                inputsDinamicos.innerHTML = `
                    <label>Factura:</label>
                    <input type="text" id="numFactura" placeholder="F-00000001">
                `
                break;
            
        }
    });

    btnBuscar.addEventListener("click", async () => {
        const tipo = tipoBusqueda.value;
        if (!tipo) return alert("Seleccione un tipo de búsqueda");

        let i = 0;

        switch (tipo) {
            case "fecha":
                const inicio = new Date(document.getElementById("fechaInicio").value);
                const fin = new Date(document.getElementById("fechaFin").value);
                if (inicio == "Invalid Date"|| fin == "Invalid Date"){Swal.fire("Debe seleccionar ambas fechas"); return};

                document.querySelectorAll(".fila").forEach(fila => {

                    const fecha = new Date(fila.querySelector(".fecha").textContent.trim());
               
                    if(fecha >= inicio && fecha <= fin){
                        i++;
                        fila.hidden = false;
                    }else{
                        fila.hidden = true;
                    }

                })

                if(i === 0){
                     Swal.fire("No hay coinsidencias")
                     cargarVentas();
                }
 
            break;
            case "estado":
                const estado = document.getElementById("estado").value;
                if(estado == ""){Swal.fire("Debe selecionar una opción"); return}

                document.querySelectorAll(".fila").forEach(fila => {

                    const estFila = fila.querySelector(".estado").textContent.trim();

                    if(estFila.includes(estado)){
                        i++;
                        fila.hidden = false;
                    }else{
                        fila.hidden = true;
                    }

                })

                if(i === 0){
                     Swal.fire("No hay coinsidencias")
                     cargarVentas();
                }
            
            break;
            case "cliente":
                const cliente = document.getElementById("clienteNombre").value.trim();
                if (!cliente) return Swal.fire("Debe ingresar el nombre del cliente");

                document.querySelectorAll(".fila").forEach(fila => {

                    const clienteFila = fila.querySelector(".nombre").textContent.trim();

                    if(!clienteFila.includes(cliente)){
                        fila.hidden = true
                    }else{
                        i++
                        fila.hidden = false
                    }
            
                })

                if(i === 0){
                     Swal.fire("No hay coinsidencias")
                     cargarVentas();
                }
            break;
            case "factura":

                const factura = document.getElementById("numFactura").value.trim();
                if(factura == ""){Swal.fire("El campo factura no puede estar vacio"); return}

                document.querySelectorAll(".fila").forEach(fila => {

                    const facFila = fila.querySelector(".factura").textContent.trim();

                    if(facFila !== factura){
                        fila.hidden = true
                    }else{
                        i++
                        fila.hidden = false
                    }
            
                })

                if(i === 0){
                     Swal.fire("No hay coinsidencias")
                     cargarVentas();
                }

            break;
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
