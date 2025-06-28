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
}
