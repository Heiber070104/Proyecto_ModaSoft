<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ventaModel;
use App\Models\inventarioModel;

class ventaController extends Controller
{
    public function consultarTodo(Request $request){

        try{
            $ventas = ventaModel::with("cliente")->with("producto")->get();
            return response()->json($ventas, 200);
        }catch(\Exception $e){
            return response()->json(['error' => 'Error en la consulta: ' . $e->getMessage()], 500);
        }

    }

    public function crearVenta(Request $request){

      try{
        // Validar los datos de la solicitud
            $data = $request->validate([
                'fecha' => 'date',
                'id_cliente' => 'required|integer',
                'estado' => 'required|string',
            ]);

            if(!$data["fecha"]){
                $data["fecha"] = now();
            }

            $venta = ventaModel::create([
                'fecha' => $data["fecha"],
                'id_cliente' => $data['id_cliente'],
                'total' => 0,
                'estado' => $data['estado'],
            ]);

            $total = 0;

            foreach ($request->productos as $producto) {

                $stock = inventarioModel::where("id_producto", $producto["id_producto"])->first();
                if($producto["cantidad"] > $stock->cantidad_disponible){
                    $venta->delete();
                    return response()->json(["message" => "La cantidad de la compra supera a la cantidad disponible"], 403);
                }

                $venta->producto()->attach($producto['id_producto'], [
                    'cantidad' => $producto['cantidad'],
                    'precio_venta' => $producto['precio_venta'],
                ]);

                $total += $producto["cantidad"];
                $stock->cantidad_disponible -= $producto["cantidad"];
                $stock->save();

            }

            $venta->update(["total" => $total]);

            return response()->json(['message' => 'Venta creada exitosamente'], 201);

        }catch(\Exception $e){
            return response()->json(['error' => 'Error al crear la venta: ' . $e->getMessage()], 500);
        }

    }
}
