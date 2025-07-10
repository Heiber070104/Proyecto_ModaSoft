<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\compraController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/api', function () {
    return json_encode([
        'message' => 'Conexión exitosa a la API',
        'status' => 'success'
    ]);
});

require __DIR__.'/compraRoutes.php';
require __DIR__.'/usuarioRoutes.php';
require __DIR__.'/productoRoutes.php';
require __DIR__.'/categoriaRoutes.php';
require __DIR__.'/tallaRoutes.php';
require __DIR__.'/proveedorRoutes.php';
require __DIR__.'/ventaRoutes.php';
require __DIR__.'/clienteRoutes.php';
require __DIR__.'/devolucionRoutes.php';

