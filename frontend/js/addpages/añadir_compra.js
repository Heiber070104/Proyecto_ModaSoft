var filaIndice = 1;
var opcionesProductos;
var select;

const agregarFila = (e) => {

    filaIndice++;

    document.getElementById("cont-productos").insertAdjacentHTML("beforeend", `
    
        <tr>
            <td>
                <select class="productos" indice="${filaIndice}">${opcionesProductos}</select>
            </td>
            <td>
                <input id="cantidad" type="number" value="0" indice="${filaIndice}" disabled>
            </td>
            <td>
                <input id="precio" type="number" value="0" indice="${filaIndice}" disabled>
            </td>
        </tr>
        
    `)

    select = document.querySelectorAll("[class='productos']")

}

document.addEventListener("DOMContentLoaded", async () => {
   
    try{

        const respr = await fetch("http://localhost:8000/proveedores",{
            method: "GET"
        })
       
        const consultapr = await respr.json();

        if(respr.ok){

            let html = "";

            Object.values(consultapr).forEach(proveedor => {
                html = `
                    <option value="${proveedor.id_proveedor}">
                        ${proveedor.nombre}
                    </option>
                `
            })
            document.getElementById("proveedores").innerHTML = html;
        }else{
            console.log(consultapr)
        }

        const respd = await fetch("http://localhost:8000/productos",{
            method: "GET"
        })

        const consultapd = await respd.json();

        if(respd.ok){

            let html = "<option value='!' hidden selected>Elija producto</option>";

            Object.values(consultapd).forEach(producto => {
                html += `
                    <option value="${producto.id_producto}">
                        ${producto.nombre} -- Precio C/U: ${producto.precio_unitario}$
                    </option>
                `
            })
            opcionesProductos = html;
            select = document.querySelector("[class='productos']");
            select.innerHTML = html;
        }else{
            console.log(consultapr)
        }

    }catch(e){
        console.log(e)
    }
    
})