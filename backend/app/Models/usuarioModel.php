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
        'nombre',
        'descripcion',
        'correo',
        'rol',
        'password',   
        'estado'
    ];

    public function sesion(){
        return $this->hasOne('App\Models\Sesion', 'id_usuario', 'id_usuario');  
    }

    // public function consultar(){
    //     return $this->all();
    // }

    // public function buscar($valor)
    // {
    //     return $this->where('id_usuario', $valor);
    // }
}
