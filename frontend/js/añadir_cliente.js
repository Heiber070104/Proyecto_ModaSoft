document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("formulario").addEventListener("submit", async (e) => {

        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const cedula = document.getElementById("cedula").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const correo = document.getElementById("correo").value.trim();

        // Validación de campos vacíos
        if (!nombre || !cedula || !direccion || !telefono || !correo) {

            Swal.fire("Debe rellenar todos los campos.");

            return false;
        }

        // Validaciones específicas
        const cedulaVal = /^\d{7,9}$/;
        const telefonoVal = /^\d{11}$/;
        const correoVal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!cedulaVal.test(cedula)) {

            Swal.fire("La cédula debe contener solo números, entre 7 y 9 dígitos.");

            return false;
        }

        if (!telefonoVal.test(telefono)) {

            Swal.fire("El teléfono debe tener exactamente 11 dígitos.");

            return false;
        }

        if (!correoVal.test(correo)) {

            Swal.fire("El correo debe tener un formato válido (ej. usuario@correo.com).");

            return false;
        }

        try {
            const res = await fetch("http://localhost:8000/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: nombre,
                    cedula: cedula,
                    direccion: direccion,
                    telefono: telefono,
                    correo: correo
                })
            });

            const consulta = await res.json();

            if (res.ok) {

                await Swal.fire({
                    title: "Exito",
                    text: consulta.message,
                    icon: "success"
}               );

                window.location.href = "clientes.html";
                return;
            }

            // Validación fallida desde Laravel (422)
            if (res.status === 422 && consulta.errors) {
                if (consulta.errors.cedula) {
                   Swal.fire("⚠️ La cédula ya está registrada o no es válida.");

                    return;
                }

                if (consulta.errors.telefono) {

                   Swal.fire("⚠️ El teléfono ya está registrado o no es válido.");

                    return;
                }

                if (consulta.errors.correo) {

                   Swal.fire("⚠️ El correo ya está registrado o tiene formato inválido.");

                    return;
                }

                const errores = Object.values(consulta.errors).flat().join("\n");

               Swal.fire("Errores en el formulario:\n" + errores);
                return;
            }

           Swal.fire("❌ Ocurrió un error inesperado. Intenta nuevamente.");

        } catch (error) {
            console.error(error);
           Swal.fire("💥 Error de red o del servidor. Verifica tu conexión o intenta más tarde.");

        }

    });

});