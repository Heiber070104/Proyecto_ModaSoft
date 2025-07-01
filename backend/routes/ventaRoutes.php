<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ventaController as Venta;

Route::prefix("ventas")->group(function (){

    Route::get("/", [Venta::class, "consultarTodo"]);
    Route::get("/completar/{id}", [Venta::class, "completarVenta"]);
    Route::get("/cancelar/{id}", [Venta::class, "cancelarVenta"]);
    Route::get("/{id}", [Venta::class, "buscarVenta"]);
    Route::post("/", [Venta::class, "crearVenta"]);
    
})

?>