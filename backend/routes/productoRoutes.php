<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\productoController as Producto;
use App\Http\Controllers\categoriaController as Categoria;
use App\Http\Controllers\tallaController as Talla;

Route::prefix("productos")->group(function () {
    // Rutas para el controlador de productos
    Route::get("/", [Producto::class, "consultarTodo"]);
    Route::get("/categoria", [Categoria::class, "consultarCategoria"]);
    Route::get("/talla", [Talla::class, "consultarTalla"]);
    Route::get("/{id}", [Producto::class, "buscarProducto"]);
   

    Route::post("/", [Producto::class, "crearProducto"]);
    Route::put("/{id}", [Producto::class, "actualizarProducto"]);
    Route::delete("/{id}", [Producto::class, "eliminarProducto"]);
});

?>