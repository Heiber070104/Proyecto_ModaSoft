document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const rol = document.getElementById('rol').value;
  const contraseña = document.getElementById('contraseña').value;
  const usuario = document.getElementById('usuario').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, correo, rol, contraseña, usuario })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Error al registrar');
    }
  } catch (err) {
    console.error(err);
    alert('Error de conexión con el servidor');
  }
});
