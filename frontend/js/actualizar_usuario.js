const contraseña = document.getElementById("contraseña");
const comparar = document.getElementById("conRepetida");
const aviso = document.getElementById("aviso");
const params = new URLSearchParams(window.location.search);
var id = params.get("id");

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

document.getElementById("formulario").addEventListener("submit", async (e) => {

    e.preventDefault();

  const conAdmin = document.getElementById("conAdmin").value;
  const comRes = await fetch("http://localhost:8000/usuarios/comprobar", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({password: conAdmin, id_usuario: id})
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
  const password = document.getElementById('contraseña').value;
  const nombre_personal = document.getElementById('nombre_personal').value;

  try {
    const res = await fetch(`http://localhost:8000/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ nombre_usuario, nombre_personal, correo, password})
    });

    const data = await res.json();

    if (res.ok) {
      await Swal.fire({
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
})

document.addEventListener("DOMContentLoaded", async () => {

    try{

        const res = await fetch(`http://localhost:8000/usuarios/${id}`);
        const consulta = await res.json();

        if(res.ok){

            Object.values(consulta).forEach(usuario => {
                document.getElementById("nombre_usuario").value = usuario.nombre_usuario;
                document.getElementById("nombre_personal").value = usuario.nombre_personal;
                document.getElementById("correo").value = usuario.correo
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

    }catch(e){

        console.log(e)
            Swal.fire({
                title: "Error",
                text: e,
                icon: "warning"
            })

    }

})
comparar.addEventListener("change", validarContraseña)
comparar.addEventListener("input", validarContraseña)
contraseña.addEventListener("change", validarContraseña)
contraseña.addEventListener("input", validarContraseña)