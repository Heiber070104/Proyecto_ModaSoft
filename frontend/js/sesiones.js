class Sesiones {
    constructor() {
        this.id = "ID"
        this.usuario = "Usuario";
        this.rol = "Rol";
    }

    iniciarSesion(datos) {
        localStorage.setItem(this.id, datos.id);
        localStorage.setItem(this.usuario, datos.usuario);
        localStorage.setItem(this.rol, datos.rol);
    }

    obtenerSesion() {
        const id = localStorage.getItem(this.id);
        const usuario = localStorage.getItem(this.usuario);
        const rol = localStorage.getItem(this.rol);
        if (id && usuario && rol) {
            return {id, usuario, rol};
        } else {
            return null; // O lanzar un error si se prefiere
        }
    }

    cerrarSesion() {
        localStorage.removeItem(this.id);
        localStorage.removeItem(this.usuario);
        localStorage.removeItem(this.rol);
    }

    sesionActiva() {
        return localStorage.getItem(this.id) !== null && localStorage.getItem(this.usuario) !== null && localStorage.getItem(this.rol) !== null;
    }
}

// Ejemplo de uso:
// const sesion = new Sesiones();
// sesion.iniciarSesion({ usuario: 'juan', rol: 'admin' });
// const datos = sesion.obtenerSesion();
// sesion.cerrarSesion();