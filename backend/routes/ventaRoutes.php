<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ventaController as Venta;

Route::prefix("ventas")->group(function (){

    Route::get("/", [Venta::class, "consultarTodo"]);
    Route::get("/pdf/{id}", [Venta::class, "generarPDF"]);
    Route::get("/productosMasVendidos", [Venta::class, "productosMasVendidos"]);
    Route::get("/productosMayorGanancias", [Venta::class, "productosMayorGanancias"]);
    Route::get("/cancelar/{id}", [Venta::class, "cancelarVenta"]);
    Route::get("/cobrar", [Venta::class, "consultarCuentasCobrar"]);
    Route::get("/cobrar/{id}", [Venta::class, "consultarCuentasCobrar"]);
    Route::get('filtrar', [ventaController::class, 'filtrarVentas']);
    Route::get("/{id}", [Venta::class, "buscarVenta"]);
    Route::put("/completar/{id}", [Venta::class, "completarVenta"]);
    Route::put("/cobrar/pagar/{id}", [Venta::class, "pagarCuentaCobrar"]);
    Route::post("/", [Venta::class, "crearVenta"]);
    // VentaRoutes.php (dentro de prefix 'ventas')
    Route::get("/factura/{factura}", [Venta::class, "buscarPorFactura"]);

})

?>