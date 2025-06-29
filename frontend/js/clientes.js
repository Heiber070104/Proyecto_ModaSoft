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
        <td>
          <button onclick="editarCliente(${cliente.id_cliente})">✏️ Modificar</button>
          <button onclick="eliminarCliente(${cliente.id_cliente})">🗑️ Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });

  } catch (error) {
    console.error("Error al cargar cliente:", error);
  }
}


function editarCliente(id) {
  // Puedes usar localStorage o query params para pasar el ID
  window.location.href = `actualizar_cliente.html?id=${id}`;
}

function eliminarCliente(id) {
  const confirmar = confirm("¿Estás seguro que deseas eliminar este cliente?");
  if (!confirmar) return;

  fetch(`http://localhost:8000/clientes/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (res.ok) {
        alert("Cliente eliminado correctamente.");
        cargarClientes();
      } else {
        alert("Error al eliminar cliente.");
      }
    })
    .catch(err => {
      console.error("Error al eliminar:" + err);
      alert("No se pudo eliminar el cliente." + err);
    });
}

document.addEventListener("DOMContentLoaded", cargarClientes);