<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ventaController as Venta;

Route::prefix("ventas")->group(function (){

    Route::get("/", [Venta::class, "consultarTodo"]);
    
})

?>