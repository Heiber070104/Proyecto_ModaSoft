<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\clienteModel;

class clienteController extends Controller
{
    public function consultarTodo(Request $request){

        try{
            $cliente = clienteModel::whereNull("deleted_at")->get();
            return response()->json($cliente, 200);
        }catch(\Exception $e){
            return response()->json([
                "error" => "error al consultar clientes: ".$e->getMessage()
            ], 500);
        }
 
    }

    public function buscarCliente(Request $request, $id){
        try{

            if(!$id){
                return response()->json(["message" => "Falta ID", 400]);
            }

            $cliente = clienteModel::findOrFail($id);
            return response()->json($cliente, 200);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Proveedor no encontrado: ' . $e->getMessage()
            ], 404);
        }
    }

    public function crearCliente(Request $request){
        try{

            $data = $request->validate([
                "cedula" => "required|integer",
                "nombre" => "required|string|max:100",
                "direccion" => "required|string|max:200",
                "telefono" => "required|string|max:20",
                "correo" => "required|email|max:100"
            ]);

            $cliente = clienteModel::create($data);

            if(!$cliente){
                return response()->json(['error' => 'Error al crear el cliente'], 500);
            }   
            return response()->json(["message" => "Cliente registrado exitosamente"], 201);

        }catch(\Exception $e){
              return response()->json([
                'error' => 'Error al crear el cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function actualizarCliente(Request $request, $id){

        try{

            if(!$id){
                return response()->json(["message" => "Falta ID del producto", 400]);
            }

            $cliente = clienteModel::findOrFail($id);
            $data = $request->validate([
                "cedula" => "required|integer",
                "nombre" => "required|string|max:100",
                "direccion" => "required|string|max:200",
                "telefono" => "required|string|max:20",
                "correo" => "required|email|max:100"
            ]);

            $cliente->update($data);

            if(!$cliente){
                return response()->json(['error' => 'Error al actualizar el cliente'], 500);
            }

            return response()->json(["message" => "Cliente actualizado exitosamente"], 200);

        }catch(\Exception $e){
            return response()->json([
                'error' => 'Error al actualizar el cliente: ' . $e->getMessage()
            ], 500);
        }

    }

    public function eliminarCliente(Request $request, $id){

        try{

            if(!$id){
                return response()->json(["message" => "Falta ID", 400]);
            }

            $cliente = clienteModel::findOrFail($id);
            $cliente->delete();

            return response()->json(["message" => "Cliente eliminado exitosamente"], 200);

        }catch(\Exception $e){
            return response()->json([
                'error' => 'Error al eliminar el cliente: ' . $e->getMessage()
            ], 500);
        }

    }

}
