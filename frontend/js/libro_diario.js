document.addEventListener("DOMContentLoaded", () => {
    axios.get('http://localhost:8000/contabilidad/libroDiario')
            .then(response => {
                const tbody = document.querySelector('#libroDiario tbody');
                response.data.forEach(transaccion => {

                    console.log(transaccion);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaccion.fecha}</td>
                        <td>${transaccion.factura}</td>
                        <td>${transaccion.cuenta_contable.nombre}</td>
                        <td>${transaccion.cuenta_contable.codigo}</td>
                        <td>${transaccion.tipo === 'DEBITO' ? transaccion.monto : ''}</td>
                        <td>${transaccion.tipo === 'CREDITO' ? transaccion.monto : ''}</td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => console.error('Error al cargar el libro diario:', error));
})