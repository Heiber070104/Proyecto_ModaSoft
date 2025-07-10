document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const factura = urlParams.get("factura");
  const infoFactura = document.getElementById("factura-info");
  const infoCliente = document.getElementById("cliente-info");
  const cuerpoTabla = document.querySelector(".cuerpo-tabla-productos");
  const productoSeleccionado = document.getElementById("producto-seleccionado");
  const form = document.getElementById("form-devolucion");
  const precio = document.getElementById("precio");

  const inputMonto = document.getElementById("monto"); 
  const idVentaInput = document.getElementById("id_venta");
  const idDetalleInput = document.getElementById("id_detalle_venta");
  const cantidadVendidaInput = document.getElementById("cantidad_vendida");
  const cantidadInput = document.getElementById("cantidad");

  if (!factura) {
    Swal.fire("Error", "No se proporcionó una factura", "error");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8000/ventas/factura/${factura}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    infoFactura.textContent = data.factura;
    infoCliente.textContent = data.cliente.nombre;
    idVentaInput.value = data.id_venta;

    cuerpoTabla.innerHTML = "";

    data.detalles.forEach(det => {

      console.log(det)
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${det.nombre}</td>
        <td>${det.talla}</td>
        <td>${det.cantidad}</td>
        <td>${det.precio.toFixed(2)}</td>
        <td><button type="button" class="seleccionar" data-id="${det.id_detalle_venta}" data-nombre="${det.nombre}" data-cantidad="${det.cantidad}" data-precio="${det.precio}">Seleccionar</button></td>
      `;
      cuerpoTabla.appendChild(fila);
    });

    document.querySelectorAll(".seleccionar").forEach(boton => {
      boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const cantidad = boton.dataset.cantidad;
        const idDetalle = boton.dataset.id;
        const precioProd = boton.dataset.precio;

        productoSeleccionado.textContent = nombre;
        idDetalleInput.value = idDetalle;
        cantidadVendidaInput.value = cantidad;
        cantidadInput.max = cantidad;
        cantidadInput.value = 1;
        precio.value = precioProd;
      });
    });



  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }

  function colocarMonto(){
    const precioProducto = precio.value;
    const cantidadDevuelto = cantidadInput.value;

    const montoTotal = parseFloat(precioProducto) * parseFloat(cantidadDevuelto);

    if(montoTotal == NaN){
      inputMonto.textContent = "0.00";
      inputMonto.dataset.total = 0.00;
      return
    }
    inputMonto.textContent = montoTotal.toFixed(2);
    inputMonto.dataset.total = montoTotal.toFixed(2);
  }

 cantidadInput.addEventListener("change", colocarMonto)
 cantidadInput.addEventListener("input", colocarMonto)

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const devolucion = {
      id_venta: idVentaInput.value,
      id_detalle_venta: idDetalleInput.value,
      cantidad: cantidadInput.value,
      motivo: document.getElementById("motivo").value,
      monto: inputMonto.dataset.total,
      fecha: document.getElementById("fecha").value,
      estado_mercancia: document.getElementById("estado_mercancia").value
    };

    if (!devolucion.id_detalle_venta) {
      return Swal.fire("Error", "Debes seleccionar un producto", "warning");
    }

    try {
      const res = await fetch("http://localhost:8000/devoluciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(devolucion)
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire("Éxito", result.message, "success").then(() => {
          window.location.href = "devoluciones.html";
        });
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (e) {
      Swal.fire("Error", "Error al registrar devolución: " + e, "error");
    }
  });
});
