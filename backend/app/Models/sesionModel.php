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
        'fecha_ultimo_acceso',
        'conectado'
    ];

    public function usuario(){
        return $this->hasOne('App\Models\usuarioModel', 'id_usuario', 'id_usuario');
    } 
}
