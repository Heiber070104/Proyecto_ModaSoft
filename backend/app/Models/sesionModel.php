<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class sesionModel extends Model
{
    use HasFactory;

    public $timestamps = false; 
    public $table = 'sesiones';
    public $primaryKey = 'id_sesion';
    public $fillable = [
        'id_sesion',
        'id_usuario',
        'nombre_usuario',
        'fecha_inicio_sesion',
        'activo'
    ];

    public function usuario(){
        return $this->hasOne('App\Models\Usuario', 'id_usuario', 'id_usuario');
    } 
}
