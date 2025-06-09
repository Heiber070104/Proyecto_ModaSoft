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
            
            html += `<tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.precio_unitario}</td>
                        <td>${producto.categoria}</td>
                        <td>${producto.talla}</td>
                        <td>${producto.cantidad}</td>
                        <td>
                            <a href="updatepages/actualizar_producto.html?id=${producto.id_producto}">
                                <button>
                                    Actualizar
                                </button>
                            </a>
                            <button onclick="eliminar(${producto.id_producto},'${producto.nombre}')">
                                Eliminar
                            </button>
                        </td>
                    </tr>
            `
          })

          document.getElementById("datos").innerHTML = html;

        }
    }catch(error){
        console.log(error)
    }

}

const eliminar = async (id, nombre) => {

   const respuesta = confirm(`¿Seguro que quiere eliminar "${nombre}" de la base de datos?`)

   if(respuesta){

        try{

            const res = await fetch(`http://localhost:8000/productos/${id}`, {
                method: "DELETE"
            })

            if(res.ok){
                alert("Producto eliminado de la base de datos")
                window.location.reload();
            }else{
                console.log("Error al eliminar el producto"+ res.message);
            }

        }catch(error){
        console.log(error)
        }

   }
}

document.addEventListener('DOMContentLoaded', actualizarTabla)