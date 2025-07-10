const actualizarTabla = async (url = "http://localhost:8000/productos") => {
    try {
        const res = await fetch(url);
        const consulta = await res.json();

        if (res.ok) {
            let html = "";

            Object.values(consulta).forEach(producto => {
                let precio_total = parseFloat(producto.precio_unitario * producto.porcentaje_ganancia / 100);
                precio_total += parseFloat(producto.precio_unitario);

                html += `<tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio_unitario}</td>
                    <td>${precio_total.toFixed(2)}</td>
                    <td>${producto.porcentaje_ganancia}%</td>
                    <td>${producto.categoria.nombre}</td>
                    <td>${producto.talla.descripcion}</td>
                    <td>${producto.inventario.cantidad_disponible}</td>
                    <td>
                        <a href="actualizar_producto.html?id=${producto.id_producto}"><button>🔨 Modificar</button></a>
                        <a href="añadir_producto.html?id=${producto.id_producto}"><button>➕ Nueva talla</button></a>
                    </td>
                </tr>`;
            });

            document.getElementById("datos").innerHTML = html;
        }
    } catch (error) {
        console.log(error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    actualizarTabla();
});

document.getElementById("tipoFiltro").addEventListener("change", function () {
    const contenedor = document.getElementById("inputsFiltro");
    contenedor.innerHTML = "";

    switch (this.value) {
        case "nombre":
            contenedor.innerHTML = `
                <label>Nombre:</label>
                <input type="text" id="filtroNombre" placeholder="Ej: Camisa">
            `;
            break;
        case "categoria":
            contenedor.innerHTML = `
                <label>Categoría:</label>
                <input type="text" id="filtroCategoria" placeholder="Ej: Caballero">
            `;
            break;
        case "talla":
            contenedor.innerHTML = `
                <label>Talla:</label>
                <input type="text" id="filtroTalla" placeholder="Ej: M">
            `;
            break;
    }
});

document.getElementById("btnBuscar").addEventListener("click", () => {
    const tipo = document.getElementById("tipoFiltro").value;
    if (!tipo) return alert("Seleccione un tipo de filtro");

    let url = `http://localhost:8000/productos/filtrar?tipo=${tipo}`;

    switch (tipo) {
        case "nombre":
            const nombre = document.getElementById("filtroNombre").value.trim();
            if (!nombre) return alert("Debe ingresar un nombre");
            url += `&valor=${encodeURIComponent(nombre)}`;
            break;
        case "categoria":
            const categoria = document.getElementById("filtroCategoria").value.trim();
            if (!categoria) return alert("Debe ingresar una categoría");
            url += `&valor=${encodeURIComponent(categoria)}`;
            break;
        case "talla":
            const talla = document.getElementById("filtroTalla").value.trim();
            if (!talla) return alert("Debe ingresar una talla");
            url += `&valor=${encodeURIComponent(talla)}`;
            break;
    }

    actualizarTabla(url);
});

document.getElementById("btnLimpiar").addEventListener("click", () => {
    document.getElementById("tipoFiltro").value = "";
    document.getElementById("inputsFiltro").innerHTML = "";
    actualizarTabla();
});
