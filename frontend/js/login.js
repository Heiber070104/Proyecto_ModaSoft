document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const contraseña = document.getElementById('contraseña').value;

  try {
   const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario, contraseña })
   })

    const data = await res.json();

    if (res.ok) {
      alert('Bienvenido ' + data.nombre);
      window.location.href = '../pages/dashboard.html'; // Aquí se redirige si login fue exitoso
    } else {
      alert(data.error || 'Credenciales incorrectas');
    }
  } catch (err) {
    alert('Error al conectar con el servidor');
    console.error(err);
  }
});
