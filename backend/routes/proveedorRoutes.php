<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\proveedorController as Proveedor;

Route::prefix("proveedores")->group(function () {
    // Rutas para el controlador de proveedores
    Route::get("/", [Proveedor::class, "consultarProveedor"]);
    Route::get("/{id}", [Proveedor::class, "buscarProveedor"]); // Assuming this is for a specific provider
    Route::post("/", [Proveedor::class, "crearProveedor"]);
    Route::put("/{id}", [Proveedor::class, "actualizarProveedor"]);
    Route::delete("/{id}", [Proveedor::class, "eliminarProveedor"]);
});

?>