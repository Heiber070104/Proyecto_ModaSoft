
document.addEventListener("DOMContentLoaded", () => {

    
    const cargarRol = () => {

        const sesion = new Sesiones().obtenerSesion();

        if(!sesion || !sesion.rol || !sesion.rol) {
            alert("No tiene autorización.");
            sesion.cerrarSesion();
            window.location.href = "../pages/login.html";
        }
        

        switch(sesion.rol){
        
            case "Vendedor":
            case "Contador":
                alert("EL usuario actual no tienen autorización para acceder a esta página.");
                window.location.href = "../pages/dashboard.html";  
            break;
            case "Gerente":
                const ocultar = document.querySelectorAll(".rol");
                ocultar.forEach(element => {
                    element.style.display = "none";
                })
            break;
        }
        

    }

    cargarRol()

    const btnAgregarFila = document.getElementById("btn-agregarFila");

    const opcionesCategoria = async () => {

        try{

            const res = await fetch("http://localhost:8000/categorias", {
                method: "GET"
            })

            const consulta = await res.json();

            if(res.ok){

                let html = "";

                Object.values(consulta).forEach(categoria => {
                    html += `<option value="${categoria.id_categoria}">${categoria.nombre}</option>`;
                })

                return html;

            }else{
                console.log(consulta.message)
            }

        }catch(e){
            console.log(e);
        }

    }

    const cargarTallas = async () => {

        const tabla = document.querySelector(".cont-tallas");
        tabla.innerHTML = "";

        try{

            const res = await fetch("http://localhost:8000/tallas", {
                method: "GET"
            })

            const consulta = await res.json();

            if(res.ok){

                Object.values(consulta).forEach(talla => {

                    const nuevaFila = document.createElement("tr");
                    nuevaFila.className = "fila";

                    nuevaFila.innerHTML = `
                        <td class="catCol" data-cat="${talla.categoria["id_categoria"]}">
                            ${talla.categoria["nombre"]}
                        </td>
                        <td class="desCol" style="width: 50%" data-id="${talla.id_talla}">
                            ${talla.descripcion}
                        </td>
                        <td class="rol">
                            <button class="btn-modificar">🔨 Modificar</button>
                            <button class="btn-registrar" hidden>✅ Registrar</button>
                            <button class="btn-cancelar" hidden>❌Cancelar</button>
                        </td> 
                    `

                    tabla.appendChild(nuevaFila);
                    eventosFila(nuevaFila);
                })

                new loaderComponent().stopLoading();

            }else{
                console.log(consulta.message)
            }

        }catch(e){
            console.log(e)
        }

    }

    cargarTallas();

    btnAgregarFila.addEventListener("click", async () => {

        const contenedor = document.querySelector(".cont-tallas");
        const nuevaFila = document.createElement("tr");
        nuevaFila.className = "fila";

        nuevaFila.innerHTML = `
            <td class="catCol">
                <select class="input categoria">
                    ${await opcionesCategoria()}
                </select>
            </td>
            <td class="desCol" style="width: 50%">
                <input type="text" class="input descripcion" placeholder="Ingrese descripcion de talla">
            </td>
            <td>
                <button class="btn-modificar" hidden>🔨 Modificar</button>
                <button class="btn-registrar">✅ Registrar</button>
                <button class="btn-cancelar">❌ Cancelar</button>
            </td> 
        `

        contenedor.appendChild(nuevaFila);
        eventosFila(nuevaFila);

    })

    const eventosFila = fila => {

        const btnModificar = fila.querySelector(".btn-modificar");
        const btnRegistrar = fila.querySelector(".btn-registrar");
        const btnCancelar = fila.querySelector(".btn-cancelar");

        btnModificar.addEventListener("click", async () => {

            const desCol = fila.querySelector(".desCol");
            const catCol = fila.querySelector(".catCol");
            const valorCat = catCol.getAttribute("data-cat");;
            const valorDes = desCol.textContent.trim();

            btnModificar.toggleAttribute("hidden", true);
            btnRegistrar.toggleAttribute("hidden", false);
            btnCancelar.toggleAttribute("hidden", false);

            catCol.innerHTML = `<select class="input categoria">${await opcionesCategoria()}</select>`;
            catCol.querySelector(".categoria").value = valorCat;
            desCol.innerHTML = `<input type="text" value="${valorDes}" class="input descripcion" placeholder="Ingrese descripcion de talla">`
            fila.classList.add("modify")

        })

        btnRegistrar.addEventListener("click", async () => {

            const id_categoria = fila.querySelector(".categoria").value;
            const descripcion = fila.querySelector(".descripcion").value;
            if(id_categoria == "" || descripcion == ""){
                Swal.fire("La descripcion de la talla está vacia, rellénelo")
                return;
            }

            if(fila.classList.contains("modify")){
                const confirm = await Swal.fire({
                      title: "¿Seguro quieres modificar esta talla?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Si",
                      cancelButtonText: "Cancelar"
                })
                if (confirm.isConfirmed) {
                    var id = fila.querySelector(".desCol").getAttribute("data-id");
                    var method = "PUT"
                    var link = `http://localhost:8000/tallas/${id}`;
                }else{
                    return;
                }
           
            }else{
                var method = "POST"
                var link = `http://localhost:8000/tallas`;
            }

            try{

                const res = await fetch(link, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        id_categoria: id_categoria,
                        descripcion: descripcion
                    })
                })

                const consulta = await res.json();

                if(res.ok){
                    Swal.fire({
                        title: "Éxito",
                        text: consulta.message,
                        icon: "success"
                    });
                    cargarTallas();
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

        btnCancelar.addEventListener("click", () => {

            if(fila.classList.contains("modify")){
                cargarTallas();
            }

            fila.remove();
        })
      
    }

})