document.addEventListener("DOMContentLoaded", async () => {
    
    try{

        const res = await fetch("http://localhost:8000/compras", {
            method: "GET"
        })

        if(res.ok){

            const consulta = await res.json();
            let html = "";

            console.log(consulta)

            Object.values(consulta).forEach(compra => {

                html += `
                    <tr>
                        <td>${compra.fecha}</td>
                        <td>${compra.proveedor["nombre"]}</td>
                        <td>${compra.total}</td>
                        <td>
                            <select id="productos">
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
                    </tr>
                `
                
            })

            document.getElementById("datos").innerHTML = html;

        }else{
            console.log(res.json())
        }

    }catch(e){
        console.log(e)
    }

    document.getElementById("productos").addEventListener("change", function () {
        if(this.options[this.selectedIndex].classList.contains("disabled")){
            this.selectedIndex = 0;
        }
    })  

})
