
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

            // const form = document.getElementById('formVenta');
            // const mensajeError = document.getElementById('mensajeError');
            // const mensajeExito = document.getElementById('mensajeExito');

            // form.addEventListener('submit', e => {
            //     e.preventDefault();
            //     mensajeError.style.display = 'none';
            //     mensajeExito.style.display = 'none';

            //     const formData = new FormData(form);
            //     const data = Object.fromEntries(formData.entries());

            //     // Convertir algunos campos a tipos correctos
            //     data.id_cliente = parseInt(data.id_cliente);
            //     data.total = parseFloat(data.total);

            //     fetch(urlVentas, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify(data),
            //     })
            //         .then(res => {
            //             if (!res.ok) return res.json().then(err => { throw err; });
            //             return res.json();
            //         })
            //         .then(resData => {
            //             mensajeExito.textContent = resData.mensaje || 'Venta registrada con éxito';
            //             mensajeExito.style.display = 'block';
            //             form.reset();
            //             cargarVentas();
            //         })
            //         .catch(err => {
            //             console.error(err);
            //             mensajeError.textContent = err.message || 'Error al registrar la venta';
            //             if (err.errors) {
            //                 // Mostrar errores de validación de Laravel
            //                 const mensajes = Object.values(err.errors).flat().join('; ');
            //                 mensajeError.textContent += ': ' + mensajes;
            //             }
            //             mensajeError.style.display = 'block';
            //         });
            // });
        });