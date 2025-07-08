
const cargarRol = () => {

        const sesion = new Sesiones().obtenerSesion();

        if(!sesion || !sesion.rol || !sesion.rol) {
            alert("No tiene autorización.");
            sesion.cerrarSesion();
            window.location.href = "../pages/login.html";
        }

        const contenedor = document.querySelector(".actions");
        let html = "";
        
        switch(sesion.rol){
        
            case "Contador":

                html = `
                  <a href="libro_contable.html"><button class="btn blue">📃 Ir a libro contable</button></a>
                  <a href="cuentas_pagar.html"><button class="btn blue">💸 Ver cuentas por pagar</button></a>
                `
                contenedor.innerHTML = html;

            break;
            case "Gerente":

              html = `
                  <a href="inventario.html"><button class="btn blue">📃 Ir a inventario</button></a>
                  <a href="ventas.html"><button class="btn blue">💲 Ver ventas realizadas</button></a>
                  <a href="cuentas_pagar.html"><button class="btn blue">💸 Ver cuentas por pagar</button></a>
                `
              contenedor.innerHTML = html;

            break;
            case "Administrador":

              html = `
                  <a href="usuarios.html"><button class="btn blue">👨‍💼 Ver usuarios del sistema</button></a>
                  <a href="inventario.html"><button class="btn blue">📃 Ir a inventario</button></a>
                  <a href="ventas.html"><button class="btn blue">💲 Ver ventas realizadas</button></a>
                  <a href="cuentas_pagar.html"><button class="btn blue">💸 Ver cuentas por pagar</button></a>
                `
              contenedor.innerHTML = html;

            break; 
            case "Comprador":

                html = `
                  <a href="compras.html"><button class="btn blue">💲 Ir a compras</button></a>
                  <a href="cuentas_pagar.html"><button class="btn blue">💸 Ver cuentas por pagar</button></a>
                `
                contenedor.innerHTML = html;

            break;
            case "Vendedor":

               html = `
                  <a href="ventas.html"><button class="btn blue">💲 Ir a ventas</button></a>
                  <a href="añadir_venta.html"><button class="btn blue">💰 Nueva venta</button></a>
                  <a href="clientes.html"><button class="btn blue">🧍‍♂️ Ver clientes</button></a>
                `
                contenedor.innerHTML = html;
               
            break;

        }
        
}

window.addEventListener('DOMContentLoaded', () => {
  
  cargarRol();

});


