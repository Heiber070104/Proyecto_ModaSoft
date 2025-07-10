const params = new URLSearchParams(window.location.search);
var id = params.get("id");

const cargarMaximo = async () => {

    try{

        // console.log("hola")
        const maximo = document.getElementById("maximo");
        const res = await fetch(`http://localhost:8000/ventas/cobrar/${id}`);
        const consulta = await res.json(); 

        if(res.ok){

            maximo.textContent = parseFloat(consulta.monto_total) - parseFloat(consulta.monto_pagado);
            maximo.dataset.max = parseFloat(consulta.monto_total) - parseFloat(consulta.monto_pagado);
            new loaderComponent().stopLoading();

        }else{
            console.log(consulta.message)
        }

    }catch(e){
        console.log(e)
    }

}

document.addEventListener("DOMContentLoaded", () => {

    cargarMaximo();

    const validarInput = () => {

        const maximo = parseFloat(document.getElementById("maximo").dataset.max);
        
        if(parseFloat(input.value) > maximo){

            Swal.fire("El monto abonado no puede ser mayor al monto de deuda restante")

            input.value = maximo;
        }
    }

    const input = document.getElementById("monto_abono");
    const formulario = document.getElementById("formulario");

    input.addEventListener("change", validarInput);
    input.addEventListener("input", validarInput);

    formulario.addEventListener("submit", async (e) => {

        e.preventDefault();

        try{

            const monto = input.value;
            const metodo_pago = document.getElementById("metodo_pago").value;

            if(!monto || monto == 0){
                Swal.fire("El monto abonado no puede ser cero o vacío");
                return;
            }
            if(metodo_pago == ""){
                Swal.fire({
                    title: "Error",
                    text: "Debe seleccionar un método de pago",
                    icon: "warning"
                });
                return;
            }

            const res = await fetch(`http://localhost:8000/ventas/cobrar/pagar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "monto_pagado": monto,
                    "metodo": metodo_pago
                })
            })

            const consulta = await res.json();
            if(res.ok){

                await Swal.fire({
                    title: "Éxito",
                    text: consulta.message,
                    icon: "success"
                });

                window.location.href = "cuentas_cobrar.html";

            }else{
                console.log(consulta.message);

                Swal.fire({
                    title: "Error",
                    text: consulta.message,
                    icon: "warning"
                });
            }

        }catch(e){
            console.error(e)
            Swal.fire({
                    title: "Error",
                    text: e,
                    icon: "warning"
            });

        }

    })

})