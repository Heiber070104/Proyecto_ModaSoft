class TopbarComponent {
  constructor() {
    this.sesion = new Sesiones().obtenerSesion();
  }

  mount() {
    const container = document.querySelector(".topbar");
    if (!this.sesion) {
      window.location.href = '../pages/login.html';
      return;
    }

    if (container) {
      container.innerHTML = this.render();
      this.setupEvents();
    } else {
      console.error("Contenedor .topbar no encontrado.");
    }
  }

render() {
  return `
    <div class="topbar-content">
      <div class="user-info">
        Usuario: <strong>${this.sesion.usuario}</strong>
      </div>
      <button id="logout" class="logout-btn" aria-label="Cerrar sesión">🔚 Cerrar Sesion</button>
    </div>
  `;
}


 setupEvents() {
  document.getElementById("logout")?.addEventListener("click", async () => {
    const confirmacion = confirm("¿Estás seguro que deseas cerrar sesión?");

    if (!confirmacion) return; // Si el usuario cancela, no hace nada

    try {
      const res = await fetch("http://localhost:8000/usuarios/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_sesion: this.sesion.id }),
      });

      if (res.ok) {
        new Sesiones().cerrarSesion();
        window.location.href = "../pages/login.html";
      } else {
        alert("Hubo un problema al cerrar la sesión.");
      }
    } catch (err) {
      console.error("Error cerrando sesión:", err);
      alert("No se pudo cerrar sesión por un error de red.");
    }
  });
}

}

new TopbarComponent().mount()
