<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\categoriaModel;

class categoriaController extends Controller
{
    public function consultarCategoria(Request $request)
    {
        try {
            $categorias = categoriaModel::all();
            return response()->json($categorias, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al consultar categorías: ' . $e->getMessage()], 500);
        }
    }
    
    public function buscarCategoria(Request $request, $id){

        try{

            $categorias = categoriaModel::find($id);
            if(!$categorias){
                return response()->json(["message" => "Categoria no encontrada"], 404);
            }
            return response()->json($categorias, 201);
        }catch(\Exception $e){
            return response()->json(["message" => "Error al consultar categorias: " . $e->getMessage()], 500);
        }

    }

    public function crearCategoria(Request $request){

        try{
            $data = $request->validate([
                "nombre" => "required|string|max:50"
            ]);

            $categoria = categoriaModel::create($data);
            return response()->json(["message" => "Categoria creada exitosamente"], 201);

        }catch(\Exception $e){
            return response()->json(["message" => "Error al consultar categorias: " . $e->getMessage()], 500);
        }

    }
    public function actualizarCategoria(Request $request, $id)
    {
        try {
            $categoria = categoriaModel::find($id);
            if (!$categoria) {
                return response()->json(['message' => 'Categoría no encontrada'], 404);
            }

            $data = $request->validate([
                'nombre' => 'required|string|max:50',
            ]);

            $categoria->update($data);
            return response()->json(['message' => 'Categoría actualizada exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar categoría: ' . $e->getMessage()], 500);
        }
    }
    public function eliminarCategoria(Request $request, $id)
    {
        try {
            $categoria = categoriaModel::find($id);
            if (!$categoria) {
                return response()->json(['message' => 'Categoría no encontrada'], 404);
            }

            $categoria->delete();
            return response()->json(['message' => 'Categoría eliminada exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar categoría: ' . $e->getMessage()], 500);
        }
    }
}
