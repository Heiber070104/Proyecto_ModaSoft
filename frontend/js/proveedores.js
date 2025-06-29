async function cargarProv() {
  try {
    const res = await fetch('http://localhost:8000/proveedores');
    const productos = await res.json();

    const tbody = document.querySelector(".cont-prov");
    tbody.innerHTML = ''; // limpiar tabla antes de cargar

    productos.forEach(prov => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${prov.nombre}</td>
        <td>${prov.direccion}</td>
        <td>${prov.telefono}</td>
        <td>${prov.correo}</td>
        <td>
          <button onclick="editarProv(${prov.id_proveedor})">✏️ Modificar</button>
          <button onclick="eliminarProv(${prov.id_proveedor})">🗑️ Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });

  } catch (error) {
    console.error("Error al cargar proveedor:", error);
  }
}


function editarProv(id) {
  // Puedes usar localStorage o query params para pasar el ID
  window.location.href = `actualizar_proveedor.html?id=${id}`;
}

function eliminarProv(id) {
  const confirmar = confirm("¿Estás seguro que deseas eliminar este proveedor?");
  if (!confirmar) return;

  fetch(`http://localhost:8000/proveedores/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (res.ok) {
        alert("Proveedor eliminado correctamente.");
        cargarProv();
      } else {
        alert("Error al eliminar proveedor.");
      }
    })
    .catch(err => {
      console.error("Error al eliminar:" + err);
      alert("No se pudo eliminar el proveedor." + err);
    });
}

document.addEventListener("DOMContentLoaded", cargarProv);
