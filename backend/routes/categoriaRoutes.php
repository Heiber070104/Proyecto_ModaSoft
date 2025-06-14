<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\categoriaController as Categoria;

Route::prefix("categorias")->group(function () {
    // Rutas para el controlador de categorías
    Route::get("/", [Categoria::class, "consultarCategoria"]);
    Route::get("/{id}", [Categoria::class, "buscarCategoria"]);
    
    Route::post("/", [Categoria::class, "crearCategoria"]);
    Route::put("/{id}", [Categoria::class, "actualizarCategoria"]);
    Route::delete("/{id}", [Categoria::class, "eliminarCategoria"]);
    
});

?>