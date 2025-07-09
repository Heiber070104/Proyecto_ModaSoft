<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\compraController as Compra;
// use App\Http\Controllers\cuentasPagarController as Pagar;

Route::prefix("compras")->group(function (){
    Route::get("/", [Compra::class, 'consultarTodo']);
    Route::get("/deudas", [Compra::class, "consultarDeudas"]);
    Route::get("/deudas/{id}", [Compra::class, "consultarDeudas"]);
    Route::get('/pdf/{id}', [Compra::class, 'generarPDF']);
    Route::get("/cancelar/{id}", [Compra::class, 'cancelarCompra']);
    Route::get("/confirmarDespacho/{id}", [Compra::class, 'confirmarDespacho']);
    Route::post("/", [Compra::class, 'crearCompra']);
    Route::put("/completar/{id}", [Compra::class, 'completarCompra']);
    Route::put("/deudas/{id}", [Compra::class, 'pagarDeuda']);
})

?>