<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\categoriaModel;

class categoriaController extends Controller
{
    public function consultarCategoria(Request $request)
    {
        // return response()->json(["message" => "hola"],201);

        try {
            $categorias = categoriaModel::all();
            return response()->json($categorias, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al consultar categorías: ' . $e->getMessage()], 500);
        }
    }
}
