
const Sesion = new Sesiones();
const sesion = Sesion.obtenerSesion();

const cambiarPagina = url => window.location.href = url;

document.getElementById("logout").addEventListener("click", async (e) => {

  try{
    
    const res = await fetch('http://localhost:8000/usuarios/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({id_sesion: sesion.id})
    });

    const respuesta = await res.json();

    if(res.ok){
      alert(respuesta.message);
      Sesion.cerrarSesion();
      window.location.href = '../pages/login.html';
    }else{
      alert(respuesta.message || 'Error al cerrar sesión');
    }

  }catch(error){
    console.error("Error al cerrar sesión:", error);
    alert("Ocurrió un error al intentar cerrar sesión. Por favor, inténtalo de nuevo más tarde.");
    return;
  }

})

window.addEventListener('DOMContentLoaded', () => {
  

  if (sesion.id === null || sesion.nombre === null || sesion.rol === null) {
    alert('Por favor, inicia sesión para acceder al dashboard.');
    window.location.href = '../pages/login.html';
    return;
  }else{
    console.log("sesion activa");
  }



});


