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
                    </tr>
            `
          })

          document.getElementById("datos").innerHTML = html;

        }
    }catch(error){
        console.log(error)
    }

}

document.addEventListener('DOMContentLoaded', actualizarTabla)