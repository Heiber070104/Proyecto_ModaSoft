<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\compraController as Compra;
use App\Http\Controllers\inventarioController as Inventario;

Route::prefix("compras")->group(function (){
    Route::get("/", [Compra::class, 'consultarTodo']);
    Route::get('/pdf/{id}', [compraController::class, 'generarPDF'])->name('compras.pdf');
    Route::get("/completar/{id}", [Compra::class, 'completarCompra']);
    Route::get("/cancelar/{id}", [Compra::class, 'cancelarCompra']);
    Route::post("/", [Compra::class, 'crearCompra']);
})

?>