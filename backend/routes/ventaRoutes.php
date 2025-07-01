<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ventaController as Venta;

Route::prefix("ventas")->group(function (){

    Route::get("/", [Venta::class, "consultarTodo"]);
    Route::get("/{id}", [Venta::class, "buscarVenta"]);
    Route::post("/", [Venta::class, "crearVenta"]);
    Route::put("/{id}", [Venta::class, "actualizarVenta"]);
    Route::delete("/{id}", [Venta::class, "eliminarVenta"]);
    
})

?>