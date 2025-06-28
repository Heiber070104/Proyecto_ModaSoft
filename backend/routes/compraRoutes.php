<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\compraController as Compra;

Route::prefix("compras")->group(function (){
    Route::get("/", [Compra::class, 'consultarTodo']);
    Route::post("/", [Compra::class, 'crearCompra']);
})

?>