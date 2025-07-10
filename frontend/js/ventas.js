document.addEventListener("DOMContentLoaded", () => {
    const tipoBusqueda = document.getElementById("tipoBusqueda");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const inputsDinamicos = document.getElementById("inputsDinamicos");

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
                        <button onclick='completarVenta(${venta.id_venta})'>✅ Completar</button>
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

    const completarVenta = async id => {
        if (!confirm("¿Confirmar completar esta venta?")) return;
        try {
            const res = await fetch(`http://localhost:8000/ventas/completar/${id}`);
            const data = await res.json();
            alert(data.message);
            if (res.ok) cargarVentas();
        } catch (e) {
            console.error(e);
        }
    };

    const cancelarVenta = async id => {
        if (!confirm("¿Confirmar cancelar esta venta?")) return;
        try {
            const res = await fetch(`http://localhost:8000/ventas/cancelar/${id}`);
            const data = await res.json();
            alert(data.message);
            if (res.ok) cargarVentas();
        } catch (e) {
            console.error(e);
        }
    };

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

    cargarVentas(); // inicial
});
