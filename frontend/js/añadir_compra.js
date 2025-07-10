document.addEventListener("DOMContentLoaded", async () => {

    const date = new Date();
    const tipoPago = document.getElementById("tipo_pago")
    const btnAgregar = document.getElementById('agregar-producto');
    const prov = document.getElementById("proveedores");
    var opcionesProductos;
    var total;
   
    document.getElementById("fecha_vence").value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    try{

        const respr = await fetch("http://localhost:8000/proveedores",{
            method: "GET"
        })
       
        const consultapr = await respr.json();

        if(respr.ok){

            let html = "";

            Object.values(consultapr).forEach(proveedor => {
                html += `
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
                    <option value="${producto.id_producto}" data-precio="${producto.precio_unitario}" data-prov="${producto.id_proveedor}">
                        ${producto.nombre} -- ${producto.talla["descripcion"]} -- ${producto.precio_unitario}$C/U
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

    new loaderComponent().stopLoading()

    btnAgregar.addEventListener('click', function() {
        const contenedor = document.querySelector(".cont-productos");
        const nuevoProducto = document.createElement('tr');
        nuevoProducto.className = "producto";
            nuevoProducto.innerHTML = `
            <td>
                <select class="select-productos" data-precio>
                    <option value='!' hidden selected>Elija producto</option>
                    ${opcionesProductos}
                </select>
            </td>
            <td><input class="cantidad" type="number" value="1" min="1"></td>
            <td><div class="subtotal">$<span class="valor-subtotal">0.00</span></div></td>
            <td><button class="eliminar">🗑</button></td>
        `;
    
        contenedor.appendChild(nuevoProducto);
        configurarEventosProducto(nuevoProducto);
        calcularTotal();
        validarProveedor(false);
        validarSelect();
    });

    document.querySelectorAll('.producto').forEach(producto => {
        configurarEventosProducto(producto);
    });

    function configurarEventosProducto(producto) {
        const select = producto.querySelector('.select-productos');
        const cantidad = producto.querySelector('.cantidad');
        const subtotal = producto.querySelector('.subtotal');
        const btnEliminar = producto.querySelector('.eliminar');
    
        select.addEventListener('change', actualizarSubtotal);
        cantidad.addEventListener('input', actualizarSubtotal);
    
        // Eliminar producto
        btnEliminar.addEventListener('click', function() {
            producto.remove();
            validarSelect();
            calcularTotal();
        });
    
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

    function validarProveedor(camProv){


        let id = document.getElementById("proveedores").value;
        document.querySelectorAll(".select-productos").forEach(select => {

            if(camProv == true){
                select.selectedIndex = "!"   
            }

            let cambio = new Event("change");
            select.dispatchEvent(cambio)

            select.querySelectorAll("option").forEach(option => {
                if(option.dataset.prov != id){
                    option.hidden  = true; 
                }else{
                    option.hidden  = false; 
                }
            })

        })

    }

    validarProveedor(true)

    prov.addEventListener("change", () => {
        validarProveedor(true);
    })


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

        const fecha = document.getElementById("fecha_vence").value;
        const id_proveedor = document.getElementById("proveedores").value;
        const tipo_pago = document.getElementById("tipo_pago").value;
  
        if(!fecha || fecha=="" || !id_proveedor || id_proveedor=="" || !total || total===0 || !tipo_pago || tipo_pago == ""){
            Swal.fire("Rellene los campos vacios")
            return false;
        }

        let productos = [];

        document.querySelectorAll(".producto").forEach(prod => {

            const id_producto = prod.querySelector(".select-productos").value;
            const cantidad = prod.querySelector(".cantidad").value;
            const precio_compra = prod.querySelector(".subtotal").textContent;

            if(!id_producto || id_producto==="!" || !cantidad || cantidad===0 || !precio_compra || precio_compra===0){
                Swal.fire("Por favor seleccione un producto en el campo vacío")
            }

            productos.push({"id_producto": id_producto, "cantidad": cantidad, "precio_compra": precio_compra});
            return false;

        })

        try{

            const res = await fetch("http://localhost:8000/compras", {
                method:  "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fecha_vence: fecha,
                    id_proveedor: id_proveedor,
                    tipo_pago: tipo_pago,
                    productos: productos
                })
            })

            const consulta = await res.json();

            if(res.ok){
                console.log(consulta)
                await Swal.fire({
                    title: "Exito",
                    text: consulta.message,
                    icon: "success"
                });
                window.location.href = "compras.html"
            }else{
                Swal.fire({
                    title: "Error",
                    text: consulta.message,
                    icon: "warning"
                });
                console.log(consulta.message)
            }

        }catch(e){
            Swal.fire({
                title: "Error",
                text: e,
                icon: "warning"
            });
            console.log(e)
        }

    })

    tipoPago.addEventListener("change", () => {

        const aviso = document.getElementById("aviso");

        if(tipoPago.value === "CONTADO"){
            aviso.hidden = true;
        }else{
            aviso.hidden = false;
        } 

    })
    
})