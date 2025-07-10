const cargarCompras = async () => {

    try {
        const contenedor = document.querySelector(".cont-compras");
        contenedor.innerHTML = "";

        const res = await fetch("http://localhost:8000/compras", {
            method: "GET"
        });

        const consulta = await res.json();

        if (res.ok) {


                consulta.forEach(compra => {
                    const fila = document.createElement("tr");
                    let acciones = "🔒 Compra cerrada";
                    let estadoTexto;

                    switch (compra.estado) {
                        case "pendiente":
                            estadoTexto = "⏳ Pendiente";
                            acciones = `
                                <button onclick='completarCompra(${compra.id_compra})'>✅ Completar orden</button>
                                <button onclick='cancelarCompra(${compra.id_compra})'>❌ Cancelar orden</button>
                            `;
                            break;
                        case "procesada":
                            estadoTexto = "✅ Completada";
                            break;
                        case "cancelada":
                            estadoTexto = "❌ Cancelada";
                            break;
                    }

                let html = "";

                const nuevaFila = document.createElement("tr");
                nuevaFila.classList = "fila";
                nuevaFila.dataset.id = compra.id_compra;

                let col;
                let estado;
                let despacho;
                let pago;

                switch (compra.estado) {
                    case "por confirmar":
                        estado = "⏳ Por confirmar";
                        col = `
                            <button onclick='completarCompra(${compra.id_compra}, "${compra.tipo_pago}")'>✅ Confirmar orden</button>
                            <button onclick='cancelarCompra(${compra.id_compra})'>❌ Cancelar orden</button>
                        `;
                    break;
                    case "confirmada":
                        estado = "✅ Confirmado";
                        col = `<button onclick="confirmarDespacho(${compra.id_compra})">🚚 Confimar despacho</button>`
                    break;
                    case "cancelada":
                        estado = "❌ Cancelado";
                        col = "🔒 Sin acciones";
                    break;
                }

                switch (compra.tipo_pago) {
                    case "CONTADO":
                        pago = "Contado 💵";
                    break;
                    case "CREDITO":
                        pago = "Crédito 💳";
                    break;
                }

                switch (compra.estado_despacho) {

                    case "pendiente":
                        despacho = "⏳ Por despachar";
                    break;
                    case "completado":
                        col = "🔒 Sin acciones";
                        despacho = "✅ Despachado";
                    break;
                    case "cancelado":
                        despacho = "❌ Cancelado";
                    break
                }

                html += `
                    <td class="factura">${compra.factura}</td>
                    <td class="fcreada">${compra.fecha_creada}</td>
                    <td class="fvence">${compra.fecha_vence}</td>
                    <td class="prov">${compra.proveedor["nombre"]}</td>
                    <td>${compra.total}</td>
                    <td class="tipo_pago">${pago}</td>
                    <td class="estado">${estado}</td>
                    <td>${despacho}</td>
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
        text: "Esta acción no se puede deshacer.",
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

const confirmarDespacho = async id => {
    const confirm = await Swal.fire({
        title: "¿Los productos ya fueron despachados?",
        text: "Los productos se agragarán a las existencias.",
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
        const res = await fetch(`http://localhost:8000/compras/confirmarDespacho/${id}`, {
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

const completarCompra = async (id, metodo) => {

    // console.log(metodo_pago)

    if(metodo === "CONTADO"){

        const confirmacion = await Swal.fire({
            title: 'Elija una forma de pago',
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

    try {
        const res = await fetch(`http://localhost:8000/compras/completar/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },body: JSON.stringify({
                metodo_pago: metodo_pago
            })
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


document.addEventListener("DOMContentLoaded", () => {
    const tipoBusqueda = document.getElementById("tipoBusqueda");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const inputsDinamicos = document.getElementById("inputsDinamicos");

    tipoBusqueda.addEventListener("change", () => {
        inputsDinamicos.innerHTML = "";

        switch (tipoBusqueda.value) {
            case "fecha":
                inputsDinamicos.innerHTML = `
                    <label>Desde:</label>
                    <input type="date" id="fechaInicio"><br>
                    <label>Hasta:</label>
                    <input type="date" id="fechaFin">
                `;
                break;
            case "estado":
                inputsDinamicos.innerHTML = `
                    <label>Estado:</label>
                    <select id="estado">
                        <option value="Por confirmar">Por confirmar</option>
                        <option value="Confirmado">Confirmada</option>
                        <option value="Cancelada">Cancelada</option>
                    </select>
                `;
                break;
            case "proveedor":
                inputsDinamicos.innerHTML = `
                    <label>Proveedor:</label>
                    <input type="text" id="nombreProveedor" placeholder="Ej: Distribuidora Lara">
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

        const tipo = tipoBusqueda.value
        let i = 0;

        switch(tipo){
            case "fecha":

                const inicio = new Date(document.getElementById("fechaInicio").value);
                const fin = new Date(document.getElementById("fechaFin").value);
       
                if (inicio == "Invalid Date"|| fin == "Invalid Date"){Swal.fire("Debe seleccionar ambas fechas"); return};
        
                document.querySelectorAll(".fila").forEach(fila => {

                    const fechaCreada = new Date(fila.querySelector(".fcreada").textContent.trim());
                    
                    if(fechaCreada >= inicio && fechaCreada <= fin){
                        i++;
                        fila.hidden = false;
                    }else{
                        fila.hidden = true;
                    }

                })

                if(i === 0){
                     Swal.fire("No hay coinsidencias")
                     cargarCompras();
                }
 
            break;
            case "estado":

                const estado = document.getElementById("estado").value.trim();
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
                }
    
            break;
            case "proveedor":

                const prov = document.getElementById("nombreProveedor").value.trim();

                document.querySelectorAll(".fila").forEach(fila => {

                    const provFila = fila.querySelector(".prov").textContent.trim();

                    if(!provFila.includes(prov)){
                        fila.hidden = true
                    }else{
                        i++
                        fila.hidden = false
                    }
            
                })

                if(i === 0){
                     Swal.fire("No hay coinsidencias")
                     cargarCompras();
                }

            break;
            case "factura":

                const factura = document.getElementById("numFactura").value.trim();

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
                     cargarCompras();
                }

             break;

        }

    });

    btnLimpiar.addEventListener("click", () => {
        cargarCompras();
        tipoBusqueda.value = "";
        inputsDinamicos.innerHTML = "";
    });

    cargarCompras()
    cargarRol();

})
