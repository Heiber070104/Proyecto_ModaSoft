document.addEventListener("DOMContentLoaded", () => {

        const productosMasVendidos = async () => {

            try{

                var nombres = [];
                var valores = [];

                const res = await fetch("http://localhost:8000/ventas/productosMasVendidos");
                const consulta = await res.json();

                if(res.ok){

                    Object.values(consulta).forEach(producto => {

                        nombres.push(`${producto.nombre} - ${producto.talla}`)
                        valores.push(producto.cantidad)

                    })

                    const productosMasVendidos = document.getElementById('productosMasVendidos');
                    const graficaMasVendidos = new Chart(productosMasVendidos, {
                        type: 'pie',
                        data: {
                        labels: nombres,
                        datasets: [{
                            label: 'N° de existencias vendidas: ',
                            data: valores,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(153, 102, 255, 0.7)',
                                'rgba(255, 159, 64, 0.7)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                   }
                });

                }
            }catch(e){
                console.log(e)
            }

        }

        const productosMayorGanacias = async () => {

            try{

                var nombres = [];
                var valores = [];

                const res = await fetch("http://localhost:8000/ventas/productosMayorGanancias");
                const consulta = await res.json();

                if(res.ok){

                    Object.values(consulta).forEach(producto => {

                        nombres.push(`${producto.nombre} - ${producto.talla}`)
                        valores.push(producto.ganancias)

                    })

                    console.log(nombres)
                    console.log(valores)

                    const productosMayorGanancia = document.getElementById('productosMayorGanancia');
                    const graficaMayorGanancia = new Chart(productosMayorGanancia, {
                        type: 'bar',
                        data: {
                        labels: nombres,
                        datasets: [{
                            label: 'Ganancias ($) ',
                            data: valores,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(153, 102, 255, 0.7)',
                                'rgba(255, 159, 64, 0.7)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                   }
                });

                }
            }catch(e){
                console.log(e)
            }

        }

    productosMasVendidos();
    productosMayorGanacias()

})