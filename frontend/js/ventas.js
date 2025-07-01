
const cargarVentas = async () => {

    try{

        const res = await fetch("http://localhost:8000/ventas", {
            method: "GET"
        })

        if(res.ok){

            const consulta = await res.json();

            Object.values(consulta).forEach(venta => {

                let html = "";
                const contenedor = document.querySelector(".cont-ventas");
                const nuevaFila = document.createElement("tr")
                nuevaFila.classList = "fila"

                html += `

                        <td>${venta.fecha}</td>
                        <td>${venta.cliente["nombre"]}</td>
                        <td>${venta.total}</td>
                        <td>

                            <select class="productos">

                                <option value="0" selected disabled hidden>Lista de productos</option>
                `

                for(producto of venta.producto){
                    html += `
                        <option class="disabled">
                            Producto: ${producto.nombre} --  
                            Cantidad: ${producto.pivot["cantidad"]} -- 
                            Precio total: ${producto.pivot["precio_venta"]} 
                        </option>
                    `
                }

                html += `
                          </select>
                        </td>
                        <td>${venta.estado}</td>

                `

                nuevaFila.innerHTML = html;
                contenedor.appendChild(nuevaFila)
                eventosFila(nuevaFila);
                
            })

        }else{
            console.log(res.json())
        }

    }catch(e){
            console.log(e)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
});