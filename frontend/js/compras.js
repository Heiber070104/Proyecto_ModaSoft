
const eventosFila = fila => {

        const select = fila.querySelector(".productos")

        select.addEventListener("change", () => {
            if(select.options[select.selectedIndex].classList.contains("disabled")){
                select.selectedIndex = 0;
            }
        })

}

const cargarCompras = async () => {

        try{
            const contenedor = document.querySelector(".cont-compras");
            contenedor.innerHTML = "";

            const res = await fetch("http://localhost:8000/compras", {
                method: "GET"
            })

            if(res.ok){

            const consulta = await res.json();

            Object.values(consulta).forEach(compra => {

                let html = "";
                
                const nuevaFila = document.createElement("tr")
                nuevaFila.classList = "fila"

                let col = "🔒 Compra cerrada"
                let estado;

                switch(compra.estado){
                    case "pendiente":
                        estado = "⏳ Pendiente"
                        col = `
                            <button onclick='completarCompra(${compra.id_compra})'>✅ Completar orden</button>
                            <button onclick='cancelarCompra(${compra.id_compra})'>❌ Cancelar orden</button>
                        `
                    break;
                    case "procesada":
                        estado = "✅ Completada"
                    break;
                    case "cancelada": 
                        estado = "❌ Cancelada"
                    break;
                }


                html += `
                        <td>${compra.id_compra}</td>
                        <td>${compra.fecha_creada}</td>
                        <td>${compra.fecha_vence}</td>
                        <td>${compra.proveedor["nombre"]}</td>
                        <td>${compra.total}</td>
                        <td>${estado}</td>
                        <td>

                            <select class="productos">

                                <option value="0" selected disabled hidden>Lista de productos</option>
                `

                for(producto of compra.producto){
                    html += `
                        <option class="disabled">
                            Producto: ${producto.nombre} --  
                            Cantidad: ${producto.pivot["cantidad"]} -- 
                            Precio total: ${producto.pivot["precio_compra"]} 
                        </option>
                    `
                }

                html += `
                          </select>
                        </td>
                        <td>${col}</td>

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

const completarCompra = async id => {

        try{

            const res = await fetch(`http://localhost:8000/compras/completar/${id}`, {
                method: "GET"
            })

            const consulta = await res.json();

            if(res.ok){
                alert(consulta.message);
                cargarCompras();
            }else{
                alert(consulta.message);
            }
        }catch(e){
            console.log(e)
        }

}

const cancelarCompra = async id => {

        try{

            const res = await fetch(`http://localhost:8000/compras/cancelar/${id}`, {
                method: "GET"
            })

            const consulta = await res.json();

            if(res.ok){
                alert(consulta.message);
                cargarCompras();
            }else{
                alert(consulta.message);
            }
        }catch(e){
            console.log(e)
        }

}

document.addEventListener("DOMContentLoaded", cargarCompras)
