<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class usuarioModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'usuario';
    public $primaryKey = 'id_usuario';
    public $fillable = [
        'nombre_usuario',
        'nombre_personal',
        'correo',
        'rol',
        'password',   
        'activo'
    ];

    public function sesion(){
        return $this->hasMany('App\Models\sesionModel', 'id_usuario', 'id_usuario');  
    }

}
