<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\inventarioModel;
use App\Models\compraModel;
use App\Models\ventaModel;
use App\Models\productoModel;

class inventarioController extends Controller
{

    public function restarStock(Request $request, $id){

        try{
            // Validar los datos de la solicitud
            $data = $request->validate([
                'cantidad' => 'required|integer|min:1',
            ]);

            // Buscar el producto en el inventario
            $producto = inventarioModel::where("id_producto", $id);

            // Verificar si hay suficiente stock
            if ($producto->stock < $data['cantidad']) {
                return response()->json(['error' => 'Stock insuficiente'], 400);
            }

            // Restar la cantidad del stock actual
            $producto->stock -= $data['cantidad'];
            $producto->save();

            return response()->json(['message' => 'Stock actualizado correctamente'], 200);
        }catch(\Exception $e){
            return response()->json(['error' => 'Error al actualizar el stock: ' . $e->getMessage()], 500);
        }

    }
}
