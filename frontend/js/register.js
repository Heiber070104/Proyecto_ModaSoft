document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const rol = document.getElementById('rol').value;
  const password = document.getElementById('contraseña').value;

  try {
    const res = await fetch('http://localhost:8000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, correo, rol, password, estado: 1})
    });

    const data = await res.json();

    if (res.ok) {
      alert("Usuario creado exitosamente");
      window.location.href = 'login.html';
    } else {
      console.log(data.message)
      alert(data.message || 'Error al registrar');
    }
  } catch (err) {
    console.error(err);
    alert('Error de conexión con el servidor');
  }
});
