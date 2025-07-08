document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("formulario").addEventListener("submit", async (e) => {

    e.preventDefault();

        // 🔹 1. Obtener los valores del formulario
        const rif = document.getElementById("rif").value.trim();
        const nombre = document.getElementById("nombre").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const correo = document.getElementById("correo").value.trim();

        // 🔹 2. Validar que ningún campo esté vacío
        if (!rif || !nombre || !direccion || !telefono || !correo) {
            Swal.fire("Debe rellenar todos los campos.");
            return false;
        }

        // validaciones específicas
        const rifVal = /^[JVGEP]-\d{8}-\d$/;
        const emailVal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonoVal = /^\d{11}$/;

        if (!rifVal.test(rif)) {
            Swal.fire("El RIF debe tener el formato correcto, como J-12345678-9.");
            return false;
        }

        if (!emailVal.test(correo)) {
            Swal.fire("El correo debe tener un formato válido (ej. usuario@correo.com).");
            return false;
        }

        if (!telefonoVal.test(telefono)) {
            Swal.fire("El teléfono debe tener entre 11 dígitos, sin letras ni espacios.");
            return false;
        }

    try {
    const res = await fetch("http://localhost:8000/proveedores", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            rif: rif,
            nombre: nombre,
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
        });
        window.location.href = "proveedores.html";
        return;
    }

    // 🔴 Si no fue ok, revisar posibles errores
    if (res.status === 422 && consulta.errors) {
        if (consulta.errors.rif) {
            Swal.fire("⚠️ El RIF ya está registrado.");
            return;
        }

        if (consulta.errors.correo) {
            Swal.fire("⚠️ El correo ya está registrado.");
            return;
        }

        const errores = Object.values(consulta.errors).flat().join("\n");
        Swal.fire({
            title: "Error",
            text: "Errores en el formulario:\n" + errores,
            icon: "warning"
        });
        return;
    }

    Swal.fire("❌ Ocurrió un error inesperado. Intenta nuevamente.");
} catch (error) {
    console.error(error);
    Swal.fire("💥 Error de red o del servidor. Verifica tu conexión o intenta más tarde.");
}
})
})
