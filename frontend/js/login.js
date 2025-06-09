
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
      
      console.log(data)

      const Sesion = new Sesiones();
      Sesion.iniciarSesion({
        id: data.id_sesion,
        usuario: data.usuario,
        rol: data.rol
      })
      alert('Bienvenido ' + data.nombre);  
      window.location.href = '../pages/dashboard.html'; // Aquí se redirige si login fue exitoso
    } else {
      console.log(data.message);
      alert(data.message);
    }
  } catch (err) {
    alert('Error al conectar con el servidor');
    console.error(err);
  }
});
