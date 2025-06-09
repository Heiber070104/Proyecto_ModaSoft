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
}
