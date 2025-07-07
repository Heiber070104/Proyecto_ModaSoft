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
        Usuario: <strong>${this.sesion.usuario}</strong> -- <strong>${this.sesion.rol}</strong>
      </div>
      <button id="logout" class="logout-btn" aria-label="Cerrar sesión">🔚 Cerrar Sesion</button>
    </div>
  `;
}


 setupEvents() {
  document.getElementById("logout")?.addEventListener("click", async () => {

    Swal.fire({
      title: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        try {
          fetch("http://localhost:8000/usuarios/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_sesion: this.sesion.id }),
          }).then(async (res) => {
            if (res.ok) {
            await Swal.fire({
              title: "¡Sesion cerrada!",
              text: "Vuelva pronto",
              icon: "success"
            });
            new Sesiones().cerrarSesion();
            window.location.href = "../pages/login.html";
          }  else {
            Swal.fire({
              title: "Hubo un problema al cerrar sesión",
              icon: "warning"
            });
          }
          })

        } catch (err) {
          console.error("Error cerrando sesión:", err);
          Swal.fire({
              title: "Hubo un problema al cerrar sesion por un error de red",
              icon: "warning"
          });
        }
      }
    });

   
  });
}

}

new TopbarComponent().mount()
