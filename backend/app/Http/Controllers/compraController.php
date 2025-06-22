<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\compraModel;
use App\Models\inventarioModel;

class compraController extends Controller
{
   public function crearCompra(Request $request)
   {
        try{
         // Validar los datos de la solicitud
            $data = $request->validate([
                'id_proveedor' => 'required|integer',
                'total' => 'required|numeric',
                'estado' => 'required|string',
            ]);

            $compra = compraModel::create([
                'fecha' => now(),
                'id_proveedor' => $data['id_proveedor'],
                'total' => $data['total'],
                'estado' => $data['estado'],
            ]);

            foreach ($request->productos as $producto) {
                $compra->producto()->attach($producto['id_producto'], [
                    'cantidad' => $producto['cantidad'],
                    'precio_compra' => $producto['precio_compra'],
                ]);

                $stock = inventarioModel::find($producto['id_producto']);
                $stock->cantidad_disponible += $producto['cantidad'];
                $stock->save();
            }

            return response()->json(['message' => 'Compra creada exitosamente'], 201);

        }catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear la compra: ' . $e->getMessage()], 500);
        }
    }
}