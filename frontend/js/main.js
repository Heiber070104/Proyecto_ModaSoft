window.addEventListener('DOMContentLoaded', () => {
  const usuario = localStorage.getItem('usuario');
  const tipoUsuario = localStorage.getItem('tipo_usuario');

  if (!usuario || !tipoUsuario) {
    window.location.href = '../pages/dashboard.html';
    return;
  }

  const userNameElement = document.getElementById('userName');
  if (userNameElement) {
    userNameElement.textContent = tipoUsuario;
  }

  mostrarSeccionesPorRol(tipoUsuario.toLowerCase());
});

const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('tipo_usuario');
    window.location.href = '../pages/login.html';
  });
}

function mostrarSeccionesPorRol(tipoUsuario) {
  const adminElements = document.querySelectorAll('.admin-only');
  const contadorElements = document.querySelectorAll('.contador-only');
  const vendedorElements = document.querySelectorAll('.vendedor-only');

  [...adminElements, ...contadorElements, ...vendedorElements].forEach(el => el.style.display = 'none');

  if (tipoUsuario === 'administrador') {
    adminElements.forEach(el => el.style.display = 'block');
  } else if (tipoUsuario === 'contador') {
    contadorElements.forEach(el => el.style.display = 'block');
  } else if (tipoUsuario === 'vendedor') {
    vendedorElements.forEach(el => el.style.display = 'block');
  }
}
