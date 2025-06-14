
const Sesion = new Sesiones();
const sesion = Sesion.obtenerSesion();

document.getElementById("logout").addEventListener("click", async (e) => {

  try{
    
    const res = await fetch('http://localhost:8000/usuarios/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({id_sesion: sesion.id})
    });

    const respuesta = await res.json();

    if(res.ok){
      alert(respuesta.message);
      Sesion.cerrarSesion();
      window.location.href = 'http://localhost:8000/view/login'; // Redirige a la página de login
    }else{
      alert(respuesta.message || 'Error al cerrar sesión');
    }

  }catch(error){
    console.error("Error al cerrar sesión:", error);
    alert("Ocurrió un error al intentar cerrar sesión. Por favor, inténtalo de nuevo más tarde.");
    return;
  }

})

window.addEventListener('DOMContentLoaded', () => {
  // const usuario = localStorage.getItem('usuario');
  // const tipoUsuario = localStorage.getItem('tipo_usuario');

  if (!sesion.id || !sesion.usuario || !sesion.rol) {
    alert('Por favor, inicia sesión para acceder al dashboard.');
    window.location.href = 'login.html';
    return;
  }else{
    console.log("sesion activa");
  }

  document.getElementById('user').textContent = sesion.usuario;
  document.getElementById('role').textContent = sesion.rol;

  // const userNameElement = document.getElementById('userName');
  // if (userNameElement) {
  //   userNameElement.textContent = sesion.rol;
  // }

  // mostrarSeccionesPorRol(sesion.rol.toLowerCase());
});

// const logoutBtn = document.getElementById('logout');
// if (logoutBtn) {
//   logoutBtn.addEventListener('click', () => {
//     localStorage.removeItem('usuario');
//     localStorage.removeItem('tipo_usuario');
//     window.location.href = '../pages/login.html';
//   });
// }

// function mostrarSeccionesPorRol((sesion.rol)) {
//   const adminElements = document.querySelectorAll('.admin-only');
//   const contadorElements = document.querySelectorAll('.contador-only');
//   const vendedorElements = document.querySelectorAll('.vendedor-only');

//   [...adminElements, ...contadorElements, ...vendedorElements].forEach(el => el.style.display = 'none');

//   if (sesion.rol === 'administrador') {
//     adminElements.forEach(el => el.style.display = 'block');
//   } else if (sesion.rol === 'contador') {
//     contadorElements.forEach(el => el.style.display = 'block');
//   } else if (sesion.rol === 'vendedor') {
//     vendedorElements.forEach(el => el.style.display = 'block');
//   }
// }
