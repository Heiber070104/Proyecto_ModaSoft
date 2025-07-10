document.addEventListener("DOMContentLoaded", () => {
  cargarDevoluciones();
  configurarBuscadorFactura();
});

// 📦 Cargar todas las devoluciones
async function cargarDevoluciones() {
  try {
    const res = await fetch("http://localhost:8000/devoluciones", {
      method: "GET"
    });

    const data = await res.json();

    if (res.ok && data.devoluciones) {
      const tbody = document.querySelector(".cuerpo-tabla-devoluciones");
      tbody.innerHTML = "";

      data.devoluciones.forEach(dev => {
        const fila = document.createElement("tr");

        let estadoFormateado = "";
        switch (dev.estado) {
          case "pendiente":
            estadoFormateado = "⌛ Pendiente";
            break;
          case "aceptada":
            estadoFormateado = "✅ Aceptada";
            break;
          case "rechazada":
            estadoFormateado = "❌ Rechazada";
            break;
        }

        fila.innerHTML = `
          <td>${dev.venta.factura}</td>
          <td>${dev.venta.cliente}</td>
          <td>${dev.producto.nombre} (${dev.producto.talla})</td>
          <td>${dev.motivo}</td>
          <td>${dev.cantidad}</td>
          <td>${dev.fecha}</td>
          <td>${estadoFormateado}</td>
          <td>
            ${dev.estado === "pendiente" ? `
              <button onclick="cambiarEstado(${dev.id_devolucion}, 'aceptada')">Aceptar</button>
              <button onclick="cambiarEstado(${dev.id_devolucion}, 'rechazada')">Rechazar</button>
            ` : "—"}
          </td>
        `;

        tbody.appendChild(fila);
      });
    } else {
      console.error("Error en respuesta:", data);
    }
  } catch (error) {
    console.error("Error al cargar devoluciones:", error);
  }
}

// Cambiar estado
async function cambiarEstado(id, nuevoEstado) {
  const confirm = await Swal.fire({
    title: `¿Deseas marcar esta devolución como ${nuevoEstado}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

  try {
  const res = await fetch(`http://localhost:8000/devoluciones/estado/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ estado: nuevoEstado })
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    const text = await res.text(); // <-- lee el texto crudo del error
    throw new Error(`Error ${res.status}: ${text}`);
  }

  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    Swal.fire("Éxito", data.message, "success");
    cargarDevoluciones();
  } else {
    throw new Error("Respuesta no válida del servidor.");
  }

} catch (e) {
  Swal.fire("Error", e.message, "error");
  console.error("Error detallado:", e);
}
}

// 🔎 Buscar factura y redirigir a añadir_devolucion.html
function configurarBuscadorFactura() {

  const input = document.getElementById('inputFactura');
  const btn = document.getElementById('btnBuscar');
  const mensaje = document.getElementById('mensaje');

  btn.addEventListener('click', () => {
    const factura = input.value.trim();
    if (!factura) {
      mensaje.textContent = 'Ingrese una factura.';
      return;
    }
    mensaje.textContent = '';
    window.location.href = `añadir_devolucion.html?factura=${encodeURIComponent(factura)}`;
  });

}
