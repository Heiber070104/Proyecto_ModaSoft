<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\viewController as ViewController;

Route::prefix("view")->group(function () {
    // Rutas para el controlador de vistas
    Route::get("/login", function () { return view("login"); })->name('view.login');
    Route::get("/dashboard", function () { return view("dashboard"); })->name('view.dashboard');
    Route::get("/register", function () { return view("register"); })->name('view.register');
    Route::get("/inventario", function () { return view("inventario"); })->name('view.inventario');
    Route::get("/tallas", function () { return view("tallas"); })->name('view.tallas');
    Route::get("/nuevoProducto", function () { return view("addpages/añadir_producto"); })->name('view.nuevoProducto');
    Route::get("/actualizarProducto/{id?}", function () { return view("updatepages/actualizar_producto"); })->name('view.actualizarProducto');
 
    
    // Rutas comentadas para futuras vistas
    // Route::get("/productos", [ViewController::class, "productos"])->name('productos');
    // Route::get("/categorias", [ViewController::class, "categorias"])->name('categorias');
    // Route::get("/tallas", [ViewController::class, "tallas"])->name('tallas');
});

?>