const cargarRol = () => {

    const sesion = new Sesiones().obtenerSesion();

    if(!sesion || !sesion.rol || !sesion.rol) {
        alert("No tiene autorización.");
        sesion.cerrarSesion();
        window.location.href = "../pages/login.html";
    }

    switch(sesion.rol){
        
        case "Comprador":
            alert("Los compradores no tienen autorización para acceder a esta página.");
            window.location.href = "../pages/dashboard.html";  
        break;
        case "Gerente":
        case "Contador":
            const ocultar = document.querySelectorAll(".rol");
            ocultar.forEach(element => {
                element.style.display = "none";
            })
        break;
    }
        
}

async function cargarClientes() {
  try {
    const res = await fetch('http://localhost:8000/clientes');
    const productos = await res.json();

    const tbody = document.querySelector(".cont-clientes");
    tbody.innerHTML = ''; // limpiar tabla antes de cargar

    productos.forEach(cliente => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${cliente.nombre}</td>
        <td>${cliente.cedula}</td>
        <td>${cliente.direccion}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.correo}</td>
        <td class="rol">
          <button onclick="editarCliente(${cliente.id_cliente})">✏️ Modificar</button>
          <button onclick="eliminarCliente(${cliente.id_cliente})">🗑️ Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });

    new loaderComponent().stopLoading();
    cargarRol();

  } catch (error) {
    console.error("Error al cargar cliente:", error);
  }
}


function editarCliente(id) {
  // Puedes usar localStorage o query params para pasar el ID
  window.location.href = `actualizar_cliente.html?id=${id}`;
}

async function eliminarCliente(id) {
  const confirm = await Swal.fire({
        title: "¿Seguro quieres borrar este cliente?",
        text: "Las ventas realizadas a este cliente se mantedrán",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "Cancelar"
  })
  if (!confirm.isConfirmed) {
      return;
  }


  fetch(`http://localhost:8000/clientes/${id}`, {
    method: "DELETE"
  })
    .then(res => {

      const consulta = res.json();
      if (res.ok) {

        Swal.fire({
          title: "Exito",
          text: consulta.message,
          icon: "warning"
        });
        cargarClientes();
      } else {
        Swal.fire({
          title: "Error",
          text: consulta.message,
          icon: "warning"
        });
      }
    })
    .catch(err => {
      console.error("Error al eliminar:" + err);
      Swal.fire({
        title: "Error",
        text: err,
        icon: "warning"
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarRol();
  cargarClientes(); 
});