<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
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

        // DB::beginTransaction();

        // Validar los datos de la solicitud
            $data = $request->validate([
                'factura' => 'required|string|max:20',
                'id_cliente' => 'required|integer',
            ]);

            $venta = ventaModel::create([
                'factura' => $data["factura"],
                'fecha' => now(),
                'id_cliente' => $data['id_cliente'],
                'total' => 0,
                'estado' => "en_proceso",
            ]);

            $total = 0;

            foreach ($request->productos as $producto) {

                $stock = inventarioModel::where("id_producto", $producto["id_producto"])->first();
                if($producto["cantidad"] > $stock->cantidad_disponible){
                    // DB::rollBack();
                    return response()->json(["message" => "La cantidad del producto ID:".$producto["id_producto"]." supera a la cantidad disponible"], 400);
                }

                $venta->producto()->attach($producto['id_producto'], [
                    'cantidad' => $producto['cantidad'],
                    'precio_venta' => $producto['precio_venta'],
                ]);

                $stock->cantidad_disponible -= $producto["cantidad"];
                $stock->save();
                $total += $producto["precio_venta"];
            
            }

            $venta->update(["total" => $total]);

            return response()->json(['message' => 'Venta creada exitosamente'], 201);
            // DB::commit();

        }catch(\Exception $e){
            // DB::rollBack();
            return response()->json(['message' => 'Error al crear la venta: ' . $e->getMessage()], 500);
        }

    }

    public function completarVenta(Request $request, $id){

        try{
            
            $venta = ventaModel::findOrFail($id);
            $venta->estado = "completada";
            $venta->save();

            return response()->json(['message' => 'Venta completada exitosamente'], 200);
        }catch(\Exception $e){
            return response()->json(['message' => 'Error al completar venta: ' . $e->getMessage()], 500);
        }

    }

    public function cancelarVenta(Request $request, $id)
    {
        try {
            if(!$id){
                return response()->json(['message' => 'ID de compra no proporcionado'], 400);
            }

            $venta = ventaModel::find($id);
            if (!$venta) { 
                return response()->json(['message' => 'Compra no encontrada'], 404);
            }

            $productos = $venta->producto->toArray();

            foreach ($productos as $producto) {

                $stock = inventarioModel::where("id_producto", $producto["id_producto"])->first();
                $stock->cantidad_disponible += $producto["pivot"]["cantidad"];
                $stock->save();

            }

            $venta->estado = 'cancelada';
            $venta->save();
           
            return response()->json(['message' => 'Venta cancelada exitosamente, existencias actualizadas'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cancelar la venta: ' . $e->getMessage()], 500);
        }
    }

}
