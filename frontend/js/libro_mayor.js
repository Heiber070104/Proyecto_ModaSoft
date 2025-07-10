document.addEventListener("DOMContentLoaded", async () => {

    try{

        const res = await fetch('http://localhost:8000/contabilidad/libroMayor')
        const consulta =  await res.json();

           const contenedor = document.getElementById('contenedor');

            consulta.forEach(cuentas => {

                    if(cuentas.saldo == null){
                        return;
                    }

                    const div = document.createElement("div");
                    const titulo = document.createElement("h2");
                    titulo.innerHTML = `${cuentas.nombre}`;
                    div.appendChild(titulo);

                    const tabla = document.createElement('table');
                    tabla.classList = "tabla"

                    const head = document.createElement('thead');
                    head.innerHTML = `
                        <tr>
                            <th>Fecha</th>
                            <th>Descripcion</th>
                            <th>Debe</th>
                            <th>Haber</th>
                            <th>Saldo</th>
                        </tr>
                    `
                    tabla.appendChild(head);

                    const body = document.createElement('tbody');
                    let saldo = 0;
                    let debe = 0;
                    let haber = 0;

                    cuentas.transacciones.forEach(transaccion => {
                        const row = document.createElement('tr');

                        switch(transaccion.tipo){
                            case "DEBITO":
                                debe += parseFloat(transaccion.monto)
                                saldo = parseFloat(saldo) + parseFloat(transaccion.monto);
                            break
                            case "CREDITO":
                                haber += parseFloat(transaccion.monto)
                                saldo = parseFloat(saldo) - parseFloat(transaccion.monto);
                            break
                        }
                        
                        row.innerHTML = `
                            <td>${transaccion.fecha}</td>
                            <td>${transaccion.descripcion}</td>
                            <td>${transaccion.tipo === 'DEBITO' ? transaccion.monto : ''}</td>
                            <td>${transaccion.tipo === 'CREDITO' ? transaccion.monto : ''}</td>
                            <td>${Math.abs(saldo).toFixed(2)}</td>
                        `
                        body.appendChild(row)

                    })

                    const finalRow = document.createElement("tr");
                    finalRow.innerHTML = `
                        <td></td>
                        <td></td>
                        <td><strong>${debe.toFixed(2)}</strong></td>
                        <td><strong>${haber.toFixed(2)}</strong></td>
                        <td><strong>${Math.abs(saldo).toFixed(2)}</strong></td>
                    `
                    body.appendChild(finalRow);

                    tabla.appendChild(body)
                    div.appendChild(tabla)
                    contenedor.insertAdjacentElement("afterend", div)
           
            });

    }catch(error){
        console.log("Error al cargar el libro mayor: " + error);
    }

})