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
            alert("Debe rellenar todos los campos.");
            return false;
        }

        // validaciones específicas
        const rifVal = /^[JVGEP]-\d{8}-\d$/;
        const emailVal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonoVal = /^\d{11}$/;

        if (!rifVal.test(rif)) {
            alert("El RIF debe tener el formato correcto, como J-12345678-9.");
            return false;
        }

        if (!emailVal.test(correo)) {
            alert("El correo debe tener un formato válido (ej. usuario@correo.com).");
            return false;
        }

        if (!telefonoVal.test(telefono)) {
            alert("El teléfono debe tener entre 11 dígitos, sin letras ni espacios.");
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
        alert("🎉 ¡Proveedor registrado exitosamente!");
        window.location.href = "proveedores.html";
        return;
    }

    // 🔴 Si no fue ok, revisar posibles errores
    if (res.status === 422 && consulta.errors) {
        if (consulta.errors.rif) {
            alert("⚠️ El RIF ya está registrado.");
            return;
        }

        if (consulta.errors.correo) {
            alert("⚠️ El correo ya está registrado.");
            return;
        }

        const errores = Object.values(consulta.errors).flat().join("\n");
        alert("Errores en el formulario:\n" + errores);
        return;
    }

    alert("❌ Ocurrió un error inesperado. Intenta nuevamente.");
} catch (error) {
    console.error(error);
    alert("💥 Error de red o del servidor. Verifica tu conexión o intenta más tarde.");
}
})
})
