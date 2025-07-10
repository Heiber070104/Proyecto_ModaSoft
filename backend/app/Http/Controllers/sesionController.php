<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\sesionModel;
use App\Models\usuarioModel;


class sesionController extends Controller
{
   public function iniciarSesion(Request $request)
    {
        try {
            $data = $request->validate([
                'usuario' => 'required|string|max:255',
                'password' => 'required|string|min:3'
            ]);

            $usuario = usuarioModel::where('nombre_usuario', $data['usuario'])->first();
   
            if ($usuario && password_verify($data['password'], $usuario->password)) {

                $sesion = sesionModel::where('id_usuario', $usuario->id_usuario)->first();

                if($sesion) {
                    // Si ya existe una sesión activa, actualizamos la fecha de inicio
                    $sesion->fecha_ultimo_acceso= now();
                    $sesion->conectado = 1; // Marcar como conectado
                    $sesion->save();

                }else{

                    $sesion = sesionModel::create([
                        'id_usuario' => $usuario->id_usuario,
                        'fecha_ultimo_acceso' => now(),
                        'conectado' => 1
                    ]);
                }

                return response()->json([
                    'message' => 'Inicio de sesión exitoso',
                    "id_sesion" => $sesion->id_sesion,
                    'usuario' => $usuario->nombre_usuario,
                    'nombre' => $usuario->nombre_personal, // Cambiado de 'nombre' a 'nombre_personal'
                    'rol' => $usuario->rol], 
                    201
                );

 
            } else {
                return response()->json(['message' => 'Credenciales incorrectas'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }


    public function cerrarSesion(Request $request)
    {
        try {

            $data = $request->validate([
                'id_sesion' => 'required|integer'
            ]);

            $sesion = sesionModel::where('id_sesion', $data)->first();
            if ($sesion) {
                $sesion->conectado = 0;
                $sesion->save();
                return response()->json(['message' => 'Sesión cerrada exitosamente'], 200);
            } else {
                return response()->json(['message' => 'No hay sesión activa para este usuario'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
