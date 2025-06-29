 async function cargarProductos() {
  try {
    const res = await fetch('http://localhost:8000/productos');
    const productos = await res.json();

    const tbody = document.getElementById("datos");
    tbody.innerHTML = ''; // limpiar tabla antes de cargar

    productos.forEach(prod => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${prod.nombre}</td>
        <td>${prod.descripcion}</td>
        <td>$${parseFloat(prod.precio_unitario).toFixed(2)}</td>
        <td>${prod.categoria}</td>
        <td>${prod.talla}</td>
        <td>
          <button onclick="editarProducto(${prod.id_producto})">✏️ Modificar</button>
          <button onclick="eliminarProducto(${prod.id_producto})">🗑️ Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });

  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function editarProducto(id) {
  // Puedes usar localStorage o query params para pasar el ID
  window.location.href = `actualizar_producto.html?id=${id}`;
}

function eliminarProducto(id) {
  const confirmar = confirm("¿Estás seguro que deseas eliminar este producto?");
  if (!confirmar) return;

  fetch(`http://localhost:8000/productos/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (res.ok) {
        alert("Producto eliminado correctamente.");
        cargarProductos();
      } else {
        alert("Error al eliminar producto.");
      }
    })
    .catch(err => {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el producto.");
    });
}

document.addEventListener("DOMContentLoaded", cargarProductos);
