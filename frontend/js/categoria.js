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

    const btnAgregarFila = document.getElementById("btn-agregarCateg");

    const cargarCateg = async () => {

        const tabla = document.querySelector(".cont-categ");
        tabla.innerHTML = "";

        try{

            const res = await fetch("http://localhost:8000/categorias", {
                method: "GET"
            })

            const consulta = await res.json();

            if(res.ok){

                Object.values(consulta).forEach(categ => {

                    const nuevaFila = document.createElement("tr");
                    nuevaFila.className = "fila";

                    nuevaFila.innerHTML = `
                        <td class="prCol" style="width: 50%" data-id="${categ.id_categoria}">
                            ${categ.nombre}
                        </td>
                        <td class="rol">
                            <button class="btn-modificar">🔨 Modificar</button>
                            <button class="btn-registrar" hidden>✅ Registrar</button>
                            <button class="btn-cancelar" hidden>❌ Cancelar</button>
                        </td> 
                    `

                    tabla.appendChild(nuevaFila);
                    eventosFila(nuevaFila);
                })

                new loaderComponent().stopLoading();
                cargarRol();
            }else{
                console.log(consulta.message)
            }

        }catch(e){
            console.log(e)
        }

    }

    cargarCateg();

    btnAgregarFila.addEventListener("click", () => {

        const contenedor = document.querySelector(".cont-categ");
        const nuevaFila = document.createElement("tr");
        nuevaFila.className = "fila";

        nuevaFila.innerHTML = `
            <td class="prCol" style="width: 50%">
                <input type="text" class="nombre" placeholder="Ingrese descripcion de categoria">
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

        btnModificar.addEventListener("click", () => {

            const prCol = fila.querySelector(".prCol");
            const valor = prCol.textContent.trim();

            btnModificar.toggleAttribute("hidden", true);
            btnRegistrar.toggleAttribute("hidden", false);
            btnCancelar.toggleAttribute("hidden", false);

            prCol.innerHTML = `<input type="text" value="${valor}" class="nombre" placeholder="Ingrese descripcion de categoria">`
            fila.classList.add("modify")

        })

        btnRegistrar.addEventListener("click", async () => {

            const nombre = fila.querySelector(".nombre").value;
            if(nombre == ""){
                Swal.fire("La nombre de la categoria está vacia, rellénelo");
                return false;
            }

            if(fila.classList.contains("modify")){
                const confirm = await Swal.fire({
                    title: "¿Seguro quieres modificar esta categoria?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si",
                    cancelButtonText: "Cancelar"
                })
                if (confirm.isConfirmed) {
                    var id = fila.querySelector(".prCol").getAttribute("data-id");
                    var method = "PUT"
                    var link = `http://localhost:8000/categorias/${id}`;
                }else{
                    return;
                }

            }else{
                var method = "POST"
                var link = `http://localhost:8000/categorias`;
            }

            try{

                const res = await fetch(link, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: nombre
                    })
                })

                const consulta = await res.json();

                if(res.ok){
                    Swal.fire({
                        title: "Éxito",
                        text: consulta.message,
                        icon: "success"
                    });
                    cargarCateg();
                }else{
                    Swal.fire({
                        title: "Error",
                        text: consulta.message,
                        icon: "warning"
                    })              
                    console.log(consulta.message)
                }

            }catch(e){
                                        
                Swal.fire({
                        title: "Error",
                        text: e,
                        icon: "warning"
                })
                    
                console.log(e)
            }

        })

        btnCancelar.addEventListener("click", () => {

            if(fila.classList.contains("modify")){

                const valor = fila.querySelector(".nombre").value;
                const prCol = fila.querySelector(".prCol"); 
                prCol.textContent = valor;

                btnModificar.toggleAttribute("hidden", false)
                btnRegistrar.toggleAttribute("hidden", true)
                btnCancelar.toggleAttribute("hidden", true)
                fila.classList.remove("modify")
                return false;
            }

            fila.remove();
        })
      
    }

})