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

    public function filtrarInventario(Request $request)
{
    try {
        $tipo = $request->input('tipo');
        $valor = $request->input('valor');

        switch ($tipo) {
            case 'nombre':
                $productos = productoModel::with(['categoria', 'talla', 'inventario'])
                    ->where('nombre', 'LIKE', "%$valor%")->get();
                break;

            case 'categoria':
                $productos = productoModel::with(['categoria', 'talla', 'inventario'])
                    ->whereHas('categoria', function ($q) use ($valor) {
                        $q->where('nombre', 'LIKE', "%$valor%");
                    })->get();
                break;

            case 'talla':
                $productos = productoModel::with(['categoria', 'talla', 'inventario'])
                    ->whereHas('talla', function ($q) use ($valor) {
                        $q->where('descripcion', 'LIKE', "%$valor%");
                    })->get();
                break;

            default:
                return response()->json(['message' => 'Filtro no válido'], 400);
        }

        return response()->json($productos, 200);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al filtrar inventario: ' . $e->getMessage()], 500);
    }
}

}
