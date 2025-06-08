<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\usuarioModel;

class usuarioController extends Controller
{
    public function consultarTodo(Request $request)
    {
        try {
            $usuarios = usuarioModel::all();
            return response()->json($usuarios);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al consultar usuarios: ' . $e->getMessage()], 500);
        }
    }

    public function buscarUsuario(Request $request, $id)
    {
        $usuario = usuarioModel::find($id);
        if ($usuario) {
            return response()->json($usuario);
        } else {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
    }

    public function crearUsuario(Request $request){

        try{

            $data = $request->validate([
                'nombre' => 'required|string|max:255',
                'correo' => 'required|email|unique:usuario,correo',
                'rol' => 'required|string|max:50',
                'password' => 'required|string|min:3',
                'estado' => 'required|boolean'
            ]);

            $data['password'] = bcrypt($data['password']);

            $usuario = usuarioModel::create($data);
            return response()->json($usuario, 201);

        } catch (\Exception $e) {

            if (app()->runningInConsole()) {
                echo "ERROR: " . $e->getMessage() . PHP_EOL;
                echo "Archivo: " . $e->getFile() . PHP_EOL;
                echo "Línea: " . $e->getLine() . PHP_EOL;
            }
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);   
        }

    }

}
