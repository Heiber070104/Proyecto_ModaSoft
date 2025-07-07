document.addEventListener("DOMContentLoaded", async () => {

    const btnAgregar = document.getElementById('agregar-producto');
    var opcionesProductos;
    var total;

    try{

        const respr = await fetch("http://localhost:8000/clientes",{
            method: "GET"
        })
       
        const consultacl = await respr.json();

        if(respr.ok){

            let html = "";

            Object.values(consultacl).forEach(cliente => {
                html += `
                    <option value="${cliente.id_cliente}">
                        ${cliente.nombre}
                    </option>
                `
            })
            document.getElementById("clientes").innerHTML = html;
        }else{
            console.log(consultapr.message)
        }

        const respd = await fetch("http://localhost:8000/productos",{
            method: "GET"
        })

        const consultapd = await respd.json();

        if(respd.ok){

            let html = "<option value='!' hidden selected>Elija producto</option>";

            Object.values(consultapd).forEach(producto => {

                let precio_venta = parseFloat(producto.precio_unitario * producto.porcentaje_ganancia / 100);
                precio_venta = parseFloat(precio_venta) + parseFloat(producto.precio_unitario);

                html += `
                    <option value="${producto.id_producto}" data-precio="${precio_venta.toFixed(2)}" data-stock=${producto.inventario["cantidad_disponible"]}>
                        ${producto.nombre} -- ${producto.talla["descripcion"]} -- ${precio_venta.toFixed(2)}$C/U
                    </option>
                `
            })
            opcionesProductos = html;
            document.querySelector(".select-productos").innerHTML = html;
        }else{
            console.log(consultapr)
        }

    }catch(e){
        console.log(e)
    }

    btnAgregar.addEventListener('click', function() {
        const contenedor = document.querySelector(".cont-productos");
        const nuevoProducto = document.createElement('tr');
        nuevoProducto.className = "producto";
            nuevoProducto.innerHTML = `
            <td>
                <select class="select-productos" data-precio data-stock>
                    <option value='!' hidden selected>Elija producto</option>
                    ${opcionesProductos}
                </select>
            </td>
            <td><input class="cantidad" type="number" value="1" min="1"></td>
            <td><div class="stock">0</div></td>
            <td><div class="subtotal">$<span class="valor-subtotal">0.00</span></div></td>
            <td><button class="eliminar">🗑</button></td>
        `;
    
        contenedor.appendChild(nuevoProducto);
        configurarEventosProducto(nuevoProducto);
        calcularTotal();
        validarSelect();
    });

    document.querySelectorAll('.producto').forEach(producto => {
        configurarEventosProducto(producto);
    });

    function configurarEventosProducto(producto) {
        const select = producto.querySelector('.select-productos');
        const cantidad = producto.querySelector('.cantidad');
        const subtotal = producto.querySelector('.subtotal');
        const stock = producto.querySelector(".stock");
        const btnEliminar = producto.querySelector('.eliminar');
    
        select.addEventListener('change', () => {actualizarSubtotal(); validarStock(true)});
        cantidad.addEventListener('input', () => {actualizarSubtotal(); validarStock(false)});
    
        // Eliminar producto
        btnEliminar.addEventListener('click', function() {
            producto.remove();
            validarSelect();
            calcularTotal();
        });

        function validarStock(cambioSelect){

            if(cambioSelect){
                cantidad.value = 1;
            }

            const stockOption = parseInt(select.selectedOptions[0]?.dataset.stock) || 0;
            const cant = parseInt(cantidad.value) || 0;
            stock.textContent = parseInt(stockOption);
            console.log(stockOption)

            if(stockOption == 0){
                cantidad.disabled = true;
                return;
            }else{
                cantidad.disabled = false;
            }

            if(cant > stockOption){
                Swal.fire("La cantidad del producto no puede superar las existencias");
                cantidad.value = stockOption;
            }

        }
    
        // Función para actualizar subtotal
        function actualizarSubtotal() {
            const precio = parseFloat(select.selectedOptions[0]?.dataset.precio) || 0;
            const cant = parseInt(cantidad.value) || 0;
            const subtotalValue = (precio * cant).toFixed(2);
      
            subtotal.textContent = subtotalValue;
            calcularTotal();
            validarSelect();
        }
    }

    function calcularTotal() {
        total = 0;
    
        document.querySelectorAll('.producto').forEach(producto => {
            const subtotal = parseFloat(producto.querySelector('.subtotal').textContent) || 0;
            total += subtotal;
        });
    
        document.getElementById('total-general').textContent = total.toFixed(2);
    }

    function validarSelect() {
         // Obtener todos los valores seleccionados
        const valores = [];

        document.querySelectorAll('.select-productos').forEach(select => {
            if (select.value) {
                valores.push(select.value);
            }
         });

         // Actualizar el estado disabled de las opciones
        document.querySelectorAll('.select-productos').forEach(select => {
            // Habilitar todas las opciones primero
            Array.from(select.options).forEach(option => {
                option.disabled = false;
            });

            // Deshabilitar opciones seleccionadas en otros selects
            valores.forEach(valor => {
                if (select.value !== valor) { // No deshabilitar la opción actualmente seleccionada
                    const optionToDisable = select.querySelector(`option[value='${valor}']`);
                    if (optionToDisable) {
                        optionToDisable.disabled = true;
                    }
                }
            });

        });
    }

    document.getElementById("btn-registrar").addEventListener("click", async () =>{

        const factura = document.getElementById("factura").value;
        const id_cliente = document.getElementById("clientes").value;

        if(!factura || factura=="" || !id_cliente || id_cliente=="" || !total || total===0){
            Swal.fire("Rellene los campos vacios")
            return false;
        }

        let productos = [];

        document.querySelectorAll(".producto").forEach(prod => {

            const id_producto = prod.querySelector(".select-productos").value;
            const cantidad = prod.querySelector(".cantidad").value;
            const precio_venta = prod.querySelector(".subtotal").textContent;

            if(!id_producto || id_producto==="!" || !cantidad || cantidad===0 || !precio_venta || precio_venta===0){
                Swal.fire("Por favor seleccione un producto en el campo vacío")
            }

            productos.push({"id_producto": id_producto, "cantidad": cantidad, "precio_venta": precio_venta});
            return false;

        })

        try{

            const res = await fetch("http://localhost:8000/ventas", {
                method:  "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    factura: factura,
                    id_cliente: id_cliente,
                    productos: productos
                })
            })

            const consulta = await res.json();

            if(res.ok){
                await Swal.fire({
                    title: "Exito",
                    text: consulta.message,
                    icon: "success"
                });
                window.location.href = "ventas.html"
            }else{
                console.log(consulta.message)
                Swal.fire({
                    title: "Error",
                    text: consulta.message,
                    icon: "warning"
                });
            }

        }catch(e){
            console.log(e)
            Swal.fire({
                title: "Error",
                text: e,
                icon: "warning"
            });
        }

    })
    
})