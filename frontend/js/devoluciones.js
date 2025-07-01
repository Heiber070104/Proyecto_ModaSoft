document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ DOM cargado');

    const btn = document.getElementById('btnBuscarVenta');
    if (!btn) {
        console.error('❌ No se encontró el botón con id btnBuscarVenta');
        return;
    }

    btn.addEventListener('click', function () {
        console.log('🟡 Botón clickeado');

        const idVenta = document.getElementById('buscarVenta').value.trim();
        console.log('🟡 ID Venta:', idVenta);

        if (!idVenta) {
            console.warn('⚠️ ID vacío');
            return;
        }

        const url = `http://127.0.0.1:8000/venta/${idVenta}`;
        console.log('📡 Haciendo fetch a:', url);

        fetch(url)
            .then(response => {
                console.log('🔁 Respuesta fetch:', response.status);
                if (!response.ok) throw new Error('Venta no encontrada');
                return response.json();
            })
            .then(data => {
                console.log('✅ Datos recibidos:', data);

                // Mostrar datos de la venta
                document.getElementById('fechaVenta').textContent = data.venta.fecha;
                document.getElementById('clienteVenta').textContent = data.venta.id_cliente;
                document.getElementById('totalVenta').textContent = data.venta.total;
                document.getElementById('estadoVenta').textContent = data.venta.estado;

                const tbody = document.querySelector('#tablaDevoluciones tbody');
                tbody.innerHTML = '';

                // Verificar que devoluciones sea un array válido
                if (!data.devolucion || !Array.isArray(data.devolucion)) {
                    console.warn('⚠️ La propiedad "devoluciones" no existe o no es un arreglo. Se usará arreglo vacío.');
                    data.devolucion = [];
                }

                data.devolucion.forEach(dev => {
                    const fila = `<tr>
                        <td>${dev.id_devolucion}</td>
                        <td>${dev.id_venta}</td>
                        <td>${dev.fecha}</td>
                        <td>${dev.motivo}</td>
                    </tr>`;
                    tbody.innerHTML += fila;
                });

                document.getElementById('resultadoVenta').style.display = 'block';
                document.getElementById('mensajeError').style.display = 'none';
            })
            .catch(error => {
                console.error('❌ Error en fetch:', error);
                document.getElementById('resultadoVenta').style.display = 'none';
                document.getElementById('mensajeError').style.display = 'block';
            });
    });
});
