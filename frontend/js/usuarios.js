 const sesion = new Sesiones().obtenerSesion();

const cargarRol = () => {

    if(!sesion || !sesion.rol || !sesion.usuario) {
        alert("No tiene autorización.");
        sesion.cerrarSesion();
        window.location.href = "../pages/login.html";
    }

    switch(sesion.rol){
        
        case "Gerente":
            document.querySelectorAll(".rol").forEach(item => {
                item.style.display = "none"
            })
        case "Administrador":
            cargarUsuarios();
        break;
        default:
            document.querySelectorAll(".rol").forEach(item => {
                item.style.display = "none"
            })
            cargarUsuarios(sesion.id);
        break;
    }
        
}

const actualizarUsuario = () => {
    window.location.href = `actualizar_usuario.html?id=${sesion.id}`
}

const cargarUsuarios = (id = null) => {

    var link;
    if(id){
        link = `http://localhost:8000/usuarios/${id}`;
    }else{
        link = "http://localhost:8000/usuarios";
    }

 
        fetch(link)
        .then(
            async res => {
                const consulta = await res.json();
                if(res.ok){

                    const contenedor = document.querySelector(".cont-usuarios");

                    Object.values(consulta).forEach(usuarios => {

                        console.log(consulta)
                        let conectado = "🟢 Conectado"
                        
                        let html = "";
                        const fila = document.createElement("tr");

                        if(usuarios.sesion === null || usuarios.sesion["conectado"] != 1){
                            conectado = "🔴 Desconectado"
                        }

                        html = `
                            <td>${usuarios.nombre_personal}</td>
                            <td>${usuarios.nombre_usuario}</td>
                            <td>${usuarios.rol}</td>
                            <td>${usuarios.correo}</td>
                            <td>${conectado}</td>
                        `
                        fila.innerHTML = html;
                        contenedor.appendChild(fila)
                    })

                    new loaderComponent().stopLoading();

                }else{
                    console.log(consulta.message)
                    Swal.fire({
                        title: "Error",
                        text: consulta.message,
                        icon: "warning"
                    })
                }
            }
        )
        .catch(
            e => {
                console.error(e)
                Swal.fire({
                    title: "Error",
                    text: e,
                    icon: "warning"
                })
            }
        )

}

document.addEventListener("DOMContentLoaded", cargarRol)