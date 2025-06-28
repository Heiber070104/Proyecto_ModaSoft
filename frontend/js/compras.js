
document.addEventListener("DOMContentLoaded", () => {

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

            const res = await fetch("http://localhost:8000/compras", {
                method: "GET"
            })

            if(res.ok){

            const consulta = await res.json();
            

            console.log(consulta)

            Object.values(consulta).forEach(compra => {


                let html = "";
                const contenedor = document.querySelector(".cont-compras");
                const nuevaFila = document.createElement("tr")
                nuevaFila.classList = "fila"

                html += `

                        <td>${compra.fecha}</td>
                        <td>${compra.proveedor["nombre"]}</td>
                        <td>${compra.total}</td>
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
                        <td>${compra.estado}</td>

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

    cargarCompras();

})
