<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\clienteController as Cliente;

Route::prefix("clientes")->group(function (){

    Route::get("/", [Cliente::class, "consultarTodo"]);

});

?>