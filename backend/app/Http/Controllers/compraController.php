<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\compraModel;
use App\Models\inventarioModel;

use App\Models\productoModel;

class compraController extends Controller
{

   public function consultarTodo(){

        try{

            $compras = compraModel::with("proveedor")->with("producto")->get();
            return response()->json($compras, 200);
        
        }catch(Exception $e){
            return response()->json(['message' => 'Error en la consulta: ' . $e->getMessage()], 500);
        }

   } 


   public function crearCompra(Request $request)
   {
        try{
         // Validar los datos de la solicitud
            $data = $request->validate([
                'fecha_vence' => 'required|date',
                'id_proveedor' => 'required|integer',
                'total' => 'required|numeric',
                'estado' => 'required|string',
            ]);

            $compra = compraModel::create([
                'fecha_creada' => now(),
                'fecha_vence' => $data["fecha_vence"],
                'id_proveedor' => $data['id_proveedor'],
                'total' => $data['total'],
                'estado' => $data['estado'],
            ]);

            foreach ($request->productos as $producto) {

                if(!$producto["id_producto"] || !$producto["cantidad"] || !$producto["precio_compra"]){
                    $compra->delete();
                    return response()->json(["message" => "Solicitud incorrecta: Faltan datos de productos"], 400);
                }

                $compra->producto()->attach($producto['id_producto'], [
                    'cantidad' => $producto['cantidad'],
                    'precio_compra' => $producto['precio_compra'],
                ]);

            }

            return response()->json(['message' => 'Compra creada exitosamente'], 201);

        }catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear la compra: ' . $e->getMessage()], 500);
        }
    }

    public function completarCompra(Request $request, $id){

        try{
            
            if(!$id){
                return response()->json(['message' => 'ID de compra no proporcionado'], 400);
            }

            $compra = compraModel::find($id);
            if (!$compra) { 
                return response()->json(['message' => 'Compra no encontrada'], 404);
            }

            $productos = $compra->producto->toArray();

            foreach ($productos as $producto) {

                $stock = inventarioModel::where("id_producto", $producto["id_producto"])->first();
                $stock->cantidad_disponible += $producto["pivot"]["cantidad"];
                $stock->save();

            }

            $compra->estado = 'procesada';
            $compra->save();

            return response()->json(['message' => 'Stock actualizado correctamente'], 200);
        }catch(\Exception $e){
            return response()->json(['message' => 'Error al actualizar el stock: ' . $e->getMessage()], 500);
        }

    }

    public function cancelarCompra($id)
    {
        try {
            $compra = compraModel::find($id);
            if (!$compra) {
                return response()->json(['message' => 'Compra no encontrada'], 404);
            }
            $compra->estado = 'cancelada';
            $compra->save();
            return response()->json(['message' => 'Compra cancelada exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cancelar la compra: ' . $e->getMessage()], 500);
        }
    }
}