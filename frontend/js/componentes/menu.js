class MenuComponent {
    constructor() {
        // 1. Al crear instancia, verifica la sesión inmediatamente
        this.sesion = new Sesiones().obtenerSesion();
        // if (!this.sesion || !this.sesion.id || !this.sesion.usuario || !this.sesion.rol) {
        //     window.location.href = '../pages/login.html';
        //     alert("Error de Sesión");
        //     return
        // }
    }

    sessions(){
        // 2. Verifica si la sesión está activa
    
        switch (this.sesion.rol) {
            case "Comprador":
                document.querySelectorAll("li").forEach(item => {
                    const vistas = item.getAttribute("data-page");
                    if(
                        vistas === "ventas.html" || 
                        vistas === "clientes.html" || 
                        vistas === "devoluciones.html" || 
                        vistas === "reportes.html"
                    ){
                        item.style.display = "none";
                    }
                })
            break;
            case "Vendedor":
                document.querySelectorAll("li").forEach(item => {
                    const vistas = item.getAttribute("data-page");
                    if(
                        vistas === "compras.html" ||
                        vistas === "proveedores.html" || 
                        vistas === "cuentas_pagar.html" || 
                        vistas === "reportes.html"
                    ){
                        item.style.display = "none";
                    }
                })    
            break;
            case "Contador":
                document.querySelectorAll("li").forEach(item => {
                    const vistas = item.getAttribute("data-page");
                    if(
                        vistas === "inventario.html" || 
                        vistas === "reportes.html"
                    ){
                        item.style.display = "none";
                    }
                })
            break;

        }

    }

    mount() {
        const container = document.querySelector(".sidebar");

        if (container) {
            container.insertAdjacentHTML("afterbegin", this.render());
            this.setupEvents();
            this.sessions();
        } else {
            console.error("Contenedor .container no encontrado para insertar el menú.");
        }
    }

render() {
    return `
        <div class="menu-logo" data-page="dashboard.html" style="cursor: pointer;">
            <img src="../public/logo_modasoft.png" alt="Logo de ModaSoft" />
        </div>
        <ul>
            <li class="menu-item" data-page="inventario.html"><span>📦</span> Inventario</li>
            <li class="menu-item" data-page="compras.html"><span>💵</span> Compras</li>
            <li class="menu-item" data-page="ventas.html"><span>💹</span> Ventas</li>
            <li class="menu-item" data-page="proveedores.html"><span>🤵</span> Proveedores</li>
            <li class="menu-item" data-page="clientes.html"><span>🧍‍♂️</span> Clientes</li>
            <li class="menu-item" data-page="cuentas_pagar.html"><span>💸</span> Cuentas por Pagar</li>
            <li class="menu-item" data-page="cuentas_cobrar.html"><span>💲</span> Cuentas por Cobrar</li>
            <li class="menu-item" data-page="devoluciones.html"><span>🧾</span> Devoluciones</li>
            <li class="menu-item" data-page="libro_diario.html"><span>📚</span> Libro Diario</li>
            <li class="menu-item" data-page="libro_mayor.html"><span>📚</span> Libro Mayor</li>
            <li class="menu-item" data-page="reportes.html"><span>📊</span> Reportes</li>
            <li class="menu-item" data-page="usuarios.html"><span>👨‍💼</span> Usuarios</li>
        </ul>
    `;
}



 
        // 3. Configura eventos de clic para cada item
    setupEvents() {
    document.querySelectorAll('.menu-item, .menu-logo').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            if (this.sesion && page) {
                window.location.href = page;
            } else {
                alert('Error de Sesión');
                window.location.href = '../pages/login.html';
            }
        });
    });
        // 4. Configura el botón de logout (usando tu código existente)
        document.getElementById('logout')?.addEventListener('click', this.handleLogout);
    }


    handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:8000/usuarios/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_sesion: this.sesion.id })
            });
            
            if (res.ok) {
                new Sesiones().cerrarSesion();
                window.location.href = '../pages/login.html';
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

new MenuComponent().mount();