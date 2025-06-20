<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\proveedorModel as Proveedor;

class proveedorController extends Controller
{
    public function consultarProveedor(Request $request){

        try{
            $proveedor = Proveedor::all();
            return response()->json($proveedor, 200);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Error al consultar el proveedor: ' . $e->getMessage()
            ], 500);
        }
      
    }  

    public function buscarProveedor($id){
        try{
            $proveedor = Proveedor::findOrFail($id);
            return response()->json($proveedor, 200);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Proveedor no encontrado: ' . $e->getMessage()
            ], 404);
        }
    }

    public function crearProveedor(Request $request){
        try{

            $data = $request->validate([
                'nombre' => 'required|string|max:100',
                'telefono' => 'required|string|max:20',
                'direccion' => 'required|string|max:200',
                'correo' => 'required|email|max:100'
            ]);

            $proveedor = Proveedor::create($data);

            if(!$proveedor){
                return response()->json(['error' => 'Error al crear el proveedor'], 500);
            }   
            return response()->json(["message" => "Proveedor registrado exitosamente"], 201);

        }catch(\Exception $e){
            return response()->json([
                'error' => 'Error al crear el proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    public function actualizarProveedor(Request $request, $id){
        try{
            $proveedor = Proveedor::findOrFail($id);
            $data = $request->validate([
                'nombre' => 'sometimes|required|string|max:100',
                'telefono' => 'sometimes|required|string|max:20',
                'direccion' => 'sometimes|required|string|max:200',
                'correo' => 'sometimes|required|email|max:100'
            ]);

            $proveedor->update($data);

            if(!$proveedor){
                return response()->json(['error' => 'Error al actualizar el proveedor'], 500);
            }

            return response()->json(["message" => "Proveedor actualizado exitosamente"], 200);

        }catch(\Exception $e){
            return response()->json([
                'error' => 'Error al actualizar el proveedor: ' . $e->getMessage()
            ], 500);
        }
    }

    public function eliminarProveedor($id){
        try{
            $proveedor = Proveedor::findOrFail($id);
            $proveedor->delete();
            return response()->json(['message' => 'Proveedor eliminado correctamente'], 200);
        }catch(\Exception $e){
            return response()->json([
                'error' => 'Error al eliminar el proveedor: ' . $e->getMessage()
            ], 500);
        }
    }
}
