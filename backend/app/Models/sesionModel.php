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
        'nombre_usuario',
        'primer_inicio_sesion',
        'ultimo_inicio_sesion',
        'conectado'
    ];

    public function usuario(){
        return $this->hasOne('App\Models\Usuario', 'nombre_usuario', 'nombre_usuario');
    } 
}
