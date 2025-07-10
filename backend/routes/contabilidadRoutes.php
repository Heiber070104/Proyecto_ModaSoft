<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\compraController as Compra;
use App\Http\Controllers\contabilidadController as Contabilidad;

Route::prefix("contabilidad")->group(function (){

    Route::get("/libroDiario", [Contabilidad::class, 'obtenerLibroDiario']);
    Route::get("/libroMayor", [Contabilidad::class, 'obtenerLibroMayor']);

    // Route::get("/", [Compra::class, 'consultarTodo']);
    // Route::get("/deudas", [Compra::class, "consultarDeudas"]);
    // Route::get("/deudas/{id}", [Compra::class, "consultarDeudas"]);
    // Route::get('/pdf/{id}', [Compra::class, 'generarPDF']);
    // Route::get("/completar/{id}", [Compra::class, 'completarCompra']);
    // Route::get("/cancelar/{id}", [Compra::class, 'cancelarCompra']);
    // Route::post("/", [Compra::class, 'crearCompra']);
    // Route::put("/deudas/{id}", [Compra::class, 'pagarDeuda']);
})


?>