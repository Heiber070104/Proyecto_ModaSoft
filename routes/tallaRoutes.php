<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\tallaController as Talla;

Route::prefix("tallas")->group(function () {
    // Rutas para el controlador de tallas
    Route::get("/", [Talla::class, "consultarTalla"]);
    Route::get("/{id}", [Talla::class, "buscarTalla"]);
    
    Route::post("/", [Talla::class, "crearTalla"]);
    Route::put("/{id}", [Talla::class, "actualizarTalla"]);
    Route::delete("/{id}", [Talla::class, "eliminarTalla"]);
});

?>