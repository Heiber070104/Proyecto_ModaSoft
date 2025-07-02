const params = new URLSearchParams(window.location.search);
var id = params.get("id");

const cargarMaximo = async () => {

    try{

        // console.log("hola")
        const maximo = document.getElementById("maximo");
        const res = await fetch(`http://localhost:8000/compras/deudas/${id}`);
        const consulta = await res.json(); 

        if(res.ok){

            maximo.textContent = parseFloat(consulta.monto_total) - parseFloat(consulta.monto_pagado);
            maximo.dataset.max = parseFloat(consulta.monto_total) - parseFloat(consulta.monto_pagado);

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
            alert("El monto abonado no puede ser mayor al monto de deuda restante")
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
            if(!monto || monto == 0){
                alert("El monto no puede ser 0")
            }

            const res = await fetch(`http://localhost:8000/compras/deudas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "monto_pagado": monto
                })
            })

            const consulta = await res.json();
            if(res.ok){

                alert(consulta.message);
                window.location.href = "cuentas_pagar.html";

            }else{
                console.log(consulta.message);
                alert(consulta.message);
            }

        }catch(e){

        }

    })

})