<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\clienteController as Cliente;

Route::prefix("clientes")->group(function (){

    Route::get("/", [Cliente::class, "consultarTodo"]);
    Route::get("/{id}", [Cliente::class, "buscarCliente"]);
    Route::post("/", [Cliente::class, "crearCliente"]);
    Route::put("/{id}", [Cliente::class, "actualizarCliente"]);
    Route::delete("/{id}", [Cliente::class, "eliminarCliente"]);

});

?>