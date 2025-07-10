<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\devolucionesController as Devolucion;

/*
|--------------------------------------------------------------------------
| Devolución Routes
|--------------------------------------------------------------------------
|
| Aquí definimos las rutas para el módulo de devoluciones, cargadas desde web.php.
|
*/

Route::prefix('devoluciones')->group(function () {

    // Registrar una nueva devolución
    Route::post('/', [Devolucion::class, 'registrar'])->name('devoluciones.registrar');

    // Listar todas las devoluciones
    Route::get('/', [Devolucion::class, 'listarDevoluciones'])->name('devoluciones.listar');

    // Cambiar estado de una devolución (pendiente, aceptada, rechazada)
    Route::put('/estado/{id}', [Devolucion::class, 'cambiarEstado'])->name('devoluciones.cambiarEstado');
});
