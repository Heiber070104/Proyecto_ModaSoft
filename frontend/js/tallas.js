document.addEventListener("DOMContentLoaded", () => {

    const btnAgregarFila = document.getElementById("btn-agregarFila");

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
                        <td class="prCol" style="width: 50%" data-id="${talla.id_talla}">
                            ${talla.descripcion}
                        </td>
                        <td>
                            <button class="btn-modificar">🔨 Modificar</button>
                            <button class="btn-registrar" hidden>✅ Registrar</button>
                            <button class="btn-cancelar" hidden>❌Cancelar</button>
                        </td> 
                    `

                    tabla.appendChild(nuevaFila);
                    eventosFila(nuevaFila);
                })


            }else{
                console.log(consulta.message)
            }

        }catch(e){
            console.log(e)
        }

    }

    cargarTallas();

    btnAgregarFila.addEventListener("click", () => {

        const contenedor = document.querySelector(".cont-tallas");
        const nuevaFila = document.createElement("tr");
        nuevaFila.className = "fila";

        nuevaFila.innerHTML = `
            <td class="prCol" style="width: 50%">
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

        btnModificar.addEventListener("click", () => {

            const prCol = fila.querySelector(".prCol");
            const valor = prCol.textContent.trim();

            btnModificar.toggleAttribute("hidden", true);
            btnRegistrar.toggleAttribute("hidden", false);
            btnCancelar.toggleAttribute("hidden", false);

            prCol.innerHTML = `<input type="text" value="${valor}" class="input descripcion" placeholder="Ingrese descripcion de talla">`
            fila.classList.add("modify")

        })

        btnRegistrar.addEventListener("click", async () => {

            const descripcion = fila.querySelector(".descripcion").value;
            if(descripcion == ""){
                alert("La descripcion de la talla está vacia, rellénelo")
                return false;
            }

            if(fila.classList.contains("modify")){
                const respuesta = confirm("¿Estas seguro que quieres modificar el nombre esta talla?")
                if(!respuesta){
                    return false;
                }

                id = fila.querySelector(".prCol").getAttribute("data-id");
                method = "PUT"
                link = `http://localhost:8000/tallas/${id}`;
            }else{
                method = "POST"
                link = `http://localhost:8000/tallas`;
            }

            try{

                const res = await fetch(link, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        descripcion: descripcion
                    })
                })

                const consulta = await res.json();

                if(res.ok){
                    alert(consulta.message);
                    cargarTallas();
                }else{
                    console.log(consulta.message)
                }

            }catch(e){
                console.log(e)
            }

        })

        btnCancelar.addEventListener("click", () => {

            if(fila.classList.contains("modify")){

                const valor = fila.querySelector(".descripcion").value;
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