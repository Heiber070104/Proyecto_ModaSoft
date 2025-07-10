
const cargarRol = () => {

        const sesion = new Sesiones().obtenerSesion();

        if(!sesion || !sesion.rol || !sesion.rol) {
            alert("No tiene autorización.");
            sesion.cerrarSesion();
            window.location.href = "../pages/login.html";
        }
        
        switch(sesion.rol){
        
            case "Contador":
                alert("EL usuario actual no tienen autorización para acceder a esta página.");
                window.location.href = "../pages/dashboard.html";  
            break;
            case "Gerente":
            case "Vendedor":
                const ocultar = document.querySelectorAll(".rol");
                ocultar.forEach(element => {
                    element.style.display = "none";
                })
            break;
        }
        
}

const actualizarTabla = async () => {

    try{
        const res = await fetch("http://localhost:8000/productos", {
            method: "GET",
            headers: {
              'Content-Type': 'application/json'
            }
        })

        const consulta = await res.json();
        if (res.ok) {
            let html = "";

            Object.values(consulta).forEach(producto => {
                let precio_total = parseFloat(producto.precio_unitario * producto.porcentaje_ganancia / 100);
                precio_total += parseFloat(producto.precio_unitario);

                console.log(producto)

                html += `
                    <tr class="fila">
                        <td class="nombre">${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.precio_unitario}</td>
                        <td>${precio_total.toFixed(2)}</td>
                        <td>${producto.porcentaje_ganancia}%</td>
                        <td class="categ">${producto.categoria.nombre}</td>
                        <td class="talla">${producto.talla.descripcion}</td>
                        <td>${producto.inventario.cantidad_disponible}</td>
                        <td>
                            <a href="actualizar_producto.html?id=${producto.id_producto}"><button>🔨 Modificar</button></a>
                            <a href="añadir_producto.html?id=${producto.id_producto}"><button>➕ Nueva talla</button></a>
                        </td>
                    </tr>
                `
            })
          document.getElementById("datos").innerHTML = html;
          new loaderComponent().stopLoading();
          cargarRol();

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
                <input type="text" id="filtroCategoria" placeholder="Ej: Camisa">
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

    let i = 0;

    switch (tipo) {
        case "nombre":
            const nombre = document.getElementById("filtroNombre").value.trim();
            if (!nombre) return alert("Debe ingresar un nombre");

                document.querySelectorAll(".fila").forEach(fila => {

                    const nomFila = fila.querySelector(".nombre").textContent.trim();

                    if(!nomFila.includes(nombre)){
                        fila.hidden = true
                    }else{
                        i++
                        fila.hidden = false
                    }
            
                })

                if(i === 0){
                     Swal.fire("No hay coinsidencias")
                     actualizarTabla();
                }
        break;
        case "categoria":
            const categoria = document.getElementById("filtroCategoria").value.trim();
            if (!categoria) return alert("Debe ingresar un nombre")

            document.querySelectorAll(".fila").forEach(fila => {

                    const nomCateg = fila.querySelector(".categ").textContent.trim();

                    if(!nomCateg.includes(categoria)){
                        fila.hidden = true
                    }else{
                        i++
                        fila.hidden = false
                    }
            
                })

                if(i === 0){
                     Swal.fire("No hay coinsidencias")
                    actualizarTabla();
                }
        break;
        case "talla":
            const talla = document.getElementById("filtroTalla").value.trim();
            if (!talla) return alert("Debe ingresar una talla");

            document.querySelectorAll(".fila").forEach(fila => {

                    const tallaFila = fila.querySelector(".fila").textContent.trim();

                    if(!tallaFila.includes(talla)){
                        fila.hidden = true
                    }else{
                        i++
                        fila.hidden = false
                    }
            
            })

            if(i === 0){
                Swal.fire("No hay coinsidencias")
                actualizarTabla();
            }

        break;
    }

});

document.getElementById("btnLimpiar").addEventListener("click", () => {
    document.getElementById("tipoFiltro").value = "";
    document.getElementById("inputsFiltro").innerHTML = "";
    cargarRol();
    actualizarTabla();
});

