<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompraController;

Route::prefix("compras")->group(function (){
    Route::get("/", [CompraController::class, 'consultarTodo']);
    Route::post("/", [CompraController::class, 'crearCompra']);
})

?>