document.addEventListener("DOMContentLoaded", function() {
    // Cargar las cuentas contables en el select
    axios.get('/api/cuentas-contables')
        .then(response => {
            const cuentasSelect = document.getElementById('id_cuenta');
            response.data.forEach(cuenta => {
                const option = document.createElement('option');
                option.value = cuenta.id_cuenta;
                option.textContent = cuenta.nombre;
                cuentasSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar las cuentas contables:', error));

    // Manejar el envío del formulario
    const form = document.getElementById('registroContableForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const fecha = document.getElementById('fecha').value;
        const idCuenta = document.getElementById('id_cuenta').value;
        const monto = document.getElementById('monto').value;
        const tipo = document.getElementById('tipo').value;

        axios.post('/api/transaccion', {
            fecha: fecha,
            id_cuenta: idCuenta,
            monto: monto,
            tipo: tipo
        })
        .then(response => {
            alert(response.data.message);
        })
        .catch(error => {
            console.error('Error al registrar la transacción:', error);
        });
    });
});
