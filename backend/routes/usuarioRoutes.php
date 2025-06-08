<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\usuarioController as Usuario;

Route::prefix("usuarios")->group(function () {
    // Rutas para el controlador de usuarios
    Route::get("/", [Usuario::class, "consultarTodo"]);
    Route::get("/{id}", [Usuario::class, "buscarUsuario"]);

    Route::post("/login", [Usuario::class, "iniciarSesion"]);
    Route::post("/", [Usuario::class, "crearUsuario"]);

    Route::put("/{id}", [Usuario::class, "actualizarUsuario"]);
    Route::delete("/{id}", [Usuario::class, "eliminarUsuario"]);
}); 

?>