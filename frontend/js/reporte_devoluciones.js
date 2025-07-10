document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:8000/devoluciones");
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    // Agrupar productos y sumar cantidades devueltas
    const totalesPorProducto = {};

    data.devoluciones.forEach(dev => {
      const nombreCompleto = `${dev.producto.nombre} - ${dev.producto.talla}`;
      if (!totalesPorProducto[nombreCompleto]) {
        totalesPorProducto[nombreCompleto] = 0;
      }
      totalesPorProducto[nombreCompleto] += dev.cantidad;
    });

    const labels = Object.keys(totalesPorProducto);
    const cantidades = Object.values(totalesPorProducto);

    const colores = labels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`);

    const ctx = document.getElementById('grafico-devoluciones').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: "Cantidad devuelta",
          data: cantidades,
          backgroundColor: colores,
          borderColor: "#fff",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "Productos devueltos"
          }
        }
      }
    });

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo cargar el gráfico de devoluciones", "error");
  }
});
