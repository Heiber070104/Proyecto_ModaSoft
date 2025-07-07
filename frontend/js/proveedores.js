const cargarRol = () => {

    const sesion = new Sesiones().obtenerSesion();

    if(!sesion || !sesion.rol || !sesion.rol) {
        alert("No tiene autorización.");
        sesion.cerrarSesion();
        window.location.href = "../pages/login.html";
    }

    switch(sesion.rol){
        
        case "Vendedor":
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

async function cargarProv() {
  try {
    const res = await fetch('http://localhost:8000/proveedores');
    const productos = await res.json();

    const tbody = document.querySelector(".cont-prov");
    tbody.innerHTML = ''; // limpiar tabla antes de cargar

    productos.forEach(prov => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${prov.rif}</td>
        <td>${prov.nombre}</td>
        <td>${prov.direccion}</td>
        <td>${prov.telefono}</td>
        <td>${prov.correo}</td>
        <td class="rol">
          <button onclick="editarProv(${prov.id_proveedor})">✏️ Modificar</button>
          <button onclick="eliminarProv(${prov.id_proveedor})">🗑️ Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });

    new loaderComponent().stopLoading();
    cargarRol();

  } catch (error) {
    console.error("Error al cargar proveedor:", error);
  }
}


function editarProv(id) {
  // Puedes usar localStorage o query params para pasar el ID
  window.location.href = `actualizar_proveedor.html?id=${id}`;
}

async function eliminarProv(id) {
  const confirm = await Swal.fire({
        title: "¿Seguro quieres eliminar este proveedor?",
        text: "Todos los productos asociados a este proveedor también se eliminarán",
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

  fetch(`http://localhost:8000/proveedores/${id}`, {
    method: "DELETE"
  })
    .then(async res => {
      const consulta = res.json();
      if (res.ok) {
        await Swal.fire({
          title: "Exito",
          text: consulta.message,
          icon: "success"
        });
        cargarProv();
      } else {
        Swal.fire({
          title: "Error",
          text: consulta.message,
          icon: "warning"
        });
        console.log(consulta.message)
      }
    })
    .catch(err => {
      console.error("Error al eliminar:" + err);
      Swal.fire({
        title: "Error",
        text: consulta.err,
        icon: "warning"
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {cargarProv(); cargarRol()});
