<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\productoController as Producto;
use App\Http\Controllers\categoriaController as Categoria;
use App\Http\Controllers\tallaController as Talla;
use App\Http\Controllers\inventarioController as Inventario;

Route::prefix("productos")->group(function () {
    // Rutas para el controlador de productos
    Route::get("/", [Producto::class, "consultarTodo"]);
    Route::get("/agregarStock/{id}", [Inventario::class, "sumarStock"]);
    Route::get("/restarStock/{id}", [Inventario::class, "restarStock"]);
    Route::get("/{id}", [Producto::class, "buscarProducto"]);
   
    Route::post("/", [Producto::class, "crearProducto"]);
    Route::put("/{id}", [Producto::class, "actualizarProducto"]);
    Route::delete("/{id}", [Producto::class, "eliminarProducto"]);
});

?>