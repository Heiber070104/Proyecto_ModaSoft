<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\usuarioModel;

class usuarioController extends Controller
{
    public function consultarTodo(Request $request)
    {
        try {
            $usuarios = usuarioModel::with("sesion")->get();
            return response()->json($usuarios, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al consultar usuarios: ' . $e->getMessage()], 500);
        }
    }

    public function consultarUsuario(Request $request, $id)
    {

        try{

            if(!is_numeric($id)) {
                $usuario = usuarioModel::where('nombre_usuario', $id)->with("sesion")->first();
                if (!$usuario) {
                    return response()->json(['message' => 'Usuario no encontrado'], 404);
                }
                return response()->json([$usuario], 200);
            }else{
                $usuario = usuarioModel::where("id_usuario", $id)->with("sesion")->first();
                if (!$usuario) {
                    return response()->json(['message' => 'Usuario no encontrado'], 404);
                }
                return response()->json([$usuario],);
            }

        }catch(\Exception $e){
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);   
        }
        

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
                'nombre_usuario' => 'required|string|max:25',
                'nombre_personal' => 'required|string|max:255',
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

    public function actualizarUsuario(Request $request, $id)
    {
        try {
            $usuario = usuarioModel::find($id);
            if (!$usuario) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            $data = $request->validate([
                'nombre_usuario' => 'required|string|max:25',
                'nombre_personal' => 'required|string|max:255',
                'correo' => 'required|email',
                'password' => 'nullable|string',
            ]);

            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            } else {
                unset($data['password']);
            }

            $usuario->update($data);
            return response()->json($usuario, 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

}
