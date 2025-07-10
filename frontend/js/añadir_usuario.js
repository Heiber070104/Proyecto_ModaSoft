const sesion = new Sesiones().obtenerSesion();
const contraseña = document.getElementById("contraseña");
const comparar = document.getElementById("conRepetida");
const aviso = document.getElementById("aviso");

const cargarRol = () => {

  if(!sesion || !sesion.rol || !sesion.usuario) {
        alert("No tiene autorización.");
        sesion.cerrarSesion();
        window.location.href = "../pages/login.html";
  }

    switch(sesion.rol){
        
        case "Comprador":
        case "Vendedor":
        case "Gerente":
        case "Contador":
            alert("No tiene autorización para acceder a esta página.");
            window.location.href = "../pages/dashboard.html";  
        break;
  
    }

}

const validarContraseña = () => {

  const btnEnviar = document.querySelector("input[type='submit']");
  console.log(btnEnviar)

  if(contraseña.value !== comparar.value){
    btnEnviar.disabled = true;
    aviso.hidden = false;
  }else{
    btnEnviar.disabled = false;
    aviso.hidden = true;
  }

}

document.getElementById('formulario').addEventListener('submit', async (e) => {

  e.preventDefault();

  const conAdmin = document.getElementById("conAdmin").value;
  const comRes = await fetch("http://localhost:8000/usuarios/comprobar", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({password: conAdmin, id_usuario: sesion.id})
  })

  const consulta = await comRes.json();
  if(!comRes.ok){
    Swal.fire({
      title: "Alerta",
      text: consulta.message,
      icon: "warning"
    })
    return
  }

  const nombre_usuario = document.getElementById('nombre_usuario').value;
  const correo = document.getElementById('correo').value;
  const rol = document.getElementById('rol').value;
  const password = document.getElementById('contraseña').value;
  const nombre_personal = document.getElementById('nombre_personal').value;

  try {
    const res = await fetch('http://localhost:8000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre_usuario, nombre_personal, correo, rol, password, estado: 1})
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        title: "Éxito",
        text: data.message,
        icon: "success"
      });
      window.location.href = 'usuarios.html';
    } else {
      console.log(data.message)
      Swal.fire({
        title: "Error",
        text: data.message,
        icon: "warning"
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
        title: "Error",
        text: err,
        icon: "warning"
    });
  }
});

comparar.addEventListener("change", validarContraseña)
comparar.addEventListener("input", validarContraseña)
document.addEventListener("DOMContentLoaded", cargarRol);