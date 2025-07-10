document.addEventListener("DOMContentLoaded", () => {
    const tipoBusqueda = document.getElementById("tipoBusqueda");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const inputsDinamicos = document.getElementById("inputsDinamicos");

    const cargarCompras = async () => {
        try {
            const contenedor = document.querySelector(".cont-compras");
            contenedor.innerHTML = "";

            const res = await fetch("http://localhost:8000/compras");

            if (res.ok) {
                const consulta = await res.json();

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

                    fila.innerHTML = `
                        <td>${compra.id_compra}</td>
                        <td>${compra.fecha_creada}</td>
                        <td>${compra.fecha_vence}</td>
                        <td>${compra.proveedor.nombre}</td>
                        <td>${compra.total}</td>
                        <td>${estadoTexto}</td>
                        <td>
                            <a href="http://localhost:8000/compras/pdf/${compra.id_compra}" target="_blank">
                                <button>📄 Detalles de compra</button>
                            </a>
                        </td>
                        <td>${acciones}</td>
                    `;
                    contenedor.appendChild(fila);
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const completarCompra = async id => {
        if (!confirm("¿Confirmar completar esta compra?")) return;
        try {
            const res = await fetch(`http://localhost:8000/compras/completar/${id}`);
            const data = await res.json();
            alert(data.message);
            if (res.ok) cargarCompras();
        } catch (e) {
            console.error(e);
        }
    };

    const cancelarCompra = async id => {
        if (!confirm("¿Confirmar cancelar esta compra?")) return;
        try {
            const res = await fetch(`http://localhost:8000/compras/cancelar/${id}`);
            const data = await res.json();
            alert(data.message);
            if (res.ok) cargarCompras();
        } catch (e) {
            console.error(e);
        }
    };

    tipoBusqueda.addEventListener("change", () => {
        inputsDinamicos.innerHTML = "";

        switch (tipoBusqueda.value) {
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
                        <option value="pendiente">Pendiente</option>
                        <option value="procesada">Procesada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                `;
                break;
            case "proveedor":
                inputsDinamicos.innerHTML = `
                    <label>Proveedor:</label>
                    <input type="text" id="nombreProveedor" placeholder="Ej: Distribuidora Lara">
                `;
                break;
        }
    });

    btnBuscar.addEventListener("click", async () => {
        const tipo = tipoBusqueda.value;
        if (!tipo) return alert("Seleccione un tipo de búsqueda");

        let url = `http://localhost:8000/compras/filtrar?tipo=${tipo}`;

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
            case "proveedor":
                const proveedor = document.getElementById("nombreProveedor").value.trim();
                if (!proveedor) return alert("Debe ingresar el nombre del proveedor");
                url += `&proveedor=${encodeURIComponent(proveedor)}`;
                break;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) {
                const contenedor = document.querySelector(".cont-compras");
                contenedor.innerHTML = "";
                data.forEach(compra => {
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

                    fila.innerHTML = `
                        <td>${compra.id_compra}</td>
                        <td>${compra.fecha_creada}</td>
                        <td>${compra.fecha_vence}</td>
                        <td>${compra.proveedor.nombre}</td>
                        <td>${compra.total}</td>
                        <td>${estadoTexto}</td>
                        <td>
                            <a href="http://localhost:8000/compras/pdf/${compra.id_compra}" target="_blank">
                                <button>📄 Detalles de compra</button>
                            </a>
                        </td>
                        <td>${acciones}</td>
                    `;
                    contenedor.appendChild(fila);
                });
            } else {
                alert(data.message || "No se encontraron resultados");
            }
        } catch (e) {
            console.error(e);
        }
    });

    btnLimpiar.addEventListener("click", () => {
        cargarCompras();
        tipoBusqueda.value = "";
        inputsDinamicos.innerHTML = "";
    });

    cargarCompras();
});
