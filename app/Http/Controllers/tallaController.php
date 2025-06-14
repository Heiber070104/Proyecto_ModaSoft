<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\tallaModel;

class tallaController extends Controller
{
    public function consultarTalla(Request $request)
    {
        try {
            $tallas = tallaModel::all();
            return response()->json($tallas, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al consultar tallas: ' . $e->getMessage()], 500);
        }
    }
    public function buscarTalla(Request $request, $id)
    {
        try {
            $talla = tallaModel::find($id);
            if (!$talla) {
                return response()->json(["message" => "Talla no encontrada"], 404);
            }
            return response()->json($talla, 201);
        } catch (\Exception $e) {
            return response()->json(["message" => "Error al consultar tallas: " . $e->getMessage()], 500);
        }
    }
    public function crearTalla(Request $request)
    {
        try {
            $data = $request->validate([
                "descripcion" => "required|string|max:50"
            ]);

            $talla = tallaModel::create($data);
            return response()->json(["message" => "Talla creada exitosamente"], 201);

        } catch (\Exception $e) {
            return response()->json(["message" => "Error al crear talla: " . $e->getMessage()], 500);
        }
    }
    public function actualizarTalla(Request $request, $id)
    {
        try {
            $talla = tallaModel::find($id);
            if (!$talla) {
                return response()->json(['message' => 'Talla no encontrada'], 404);
            }

            $data = $request->validate([
                'descripcion' => 'required|string|max:50',
            ]);

            $talla->update($data);
            return response()->json(['message' => 'Talla actualizada exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar talla: ' . $e->getMessage()], 500);
        }
    }   
    public function eliminarTalla(Request $request, $id)
    {
        try {
            $talla = tallaModel::find($id);
            if (!$talla) {
                return response()->json(['message' => 'Talla no encontrada'], 404);
            }

            $talla->delete();
            return response()->json(['message' => 'Talla eliminada exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar talla: ' . $e->getMessage()], 500);
        }
    }
}
