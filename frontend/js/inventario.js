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
        
        if(res.ok){
      
          let html = ""; 
            
          Object.values(consulta).forEach(producto => {

            precio_total = parseFloat(producto.precio_unitario  * producto.porcentaje_ganancia / 100);
            precio_total = parseFloat(precio_total) + parseFloat(producto.precio_unitario);
            
            html += `<tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.precio_unitario}</td>
                        <td>${precio_total.toFixed(2)}</td>
                        <td>${producto.porcentaje_ganancia}%</td>
                        <td>${producto.categoria["nombre"]}</td>
                        <td>${producto.talla["descripcion"]}</td>
                        <td>${producto.inventario["cantidad_disponible"]}</td>
                        <td class="rol">
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
    }catch(error){
        console.log(error)
    }

}

document.addEventListener('DOMContentLoaded', () => {cargarRol(); actualizarTabla()})