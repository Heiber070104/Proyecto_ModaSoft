
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('contraseña').value;

  try {
   const res = await fetch('http://localhost:8000/usuarios/login', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify({usuario, password})
   })

    const data = await res.json();

    if (res.ok) {

      const Sesion = new Sesiones();
      Sesion.iniciarSesion({
        id: data.id_sesion,
        usuario: data.usuario,
        rol: data.rol
      })
      await Swal.fire({
          title: "Inicio de sesión exitoso",
          text: "Bienvenido " + data.nombre,
          icon: "success",
          confirmButtonText: "Ir al inicio"
      }); 
      window.location.href = '../pages/dashboard.html'; // Aquí se redirige si login fue exitoso
    } else {
      console.log(data.message);
      Swal.fire({
          title: "Problema al iniciar sesión",
          text: data.message,
          icon: "warning"
      });
    }
  } catch (err) {
    Swal.fire({title:'Error al conectar con el servidor, intente más tarde', 
      text: err, 
      icon: "warning"
    });
    console.error(err);
  }
});
