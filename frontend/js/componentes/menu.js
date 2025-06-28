class MenuComponent {
    constructor() {
        // 1. Al crear instancia, verifica la sesión inmediatamente
        this.sesion = new Sesiones().obtenerSesion();
    }

    mount() {
        const container = document.querySelector(".sidebar");

        if (container) {
            container.insertAdjacentHTML("afterbegin", this.render());
            this.setupEvents();
        } else {
            console.error("Contenedor .container no encontrado para insertar el menú.");
        }
    }

    render() {
        // 2. Devuelve el HTML del menú como string

        return `
    
            <img src="../public/logo_modasoft.png" alt="Logo de ModaSoft" />
                <ul>
                    <li class="menu-item" data-page="productos.html"><span>🛍️</span> Productos</li>
                    <li class="menu-item" data-page="inventario.html"><span>📦</span> Inventario</li>
                    <li class="menu-item" data-page="compras.html"><span>💵</span> Compras</li>
                    <li class="menu-item" data-page="proveedores.html"><span>🤵</span> Proveedores</li>
                    <li><span>💲</span> Cuentas por Pagar/ Cobrar</li>
                    <li class="menu-item" data-page="devoluciones.html"><span>🧾</span> Devoluciones</button></li>
                    <li><span>📚</span> Libro Diario/Mayor</li>
                    <li><span>📄</span> Registro Contable</li>
                </ul>

        `;
    }

    setupEvents() {
        // 3. Configura eventos de clic para cada item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                if (this.sesion) {
                    window.location.href = item.dataset.page;
                } else {
                    alert('Error de Sesion');
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