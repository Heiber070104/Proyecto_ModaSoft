class loaderComponent{

     constructor() {
    this.sesion = new Sesiones().obtenerSesion();
  }

  mount() {
    const container = document.querySelector(".welcome");
    if (!this.sesion) {
      window.location.href = '../pages/login.html';
      return;
    }

    if (container) {
      container.insertAdjacentHTML("beforebegin", this.render());
    } else {
      console.error("Contenedor .topbar no encontrado.");
    }
  }

render() {
  return `
    <div class="loader">
        <div class="loader-spinner"></div>
        <p>Cargando...</p>
    </div>
  `;
}

stopLoading(){
    document.querySelector('.loader').style.display = 'none';
}

}

new loaderComponent().mount();