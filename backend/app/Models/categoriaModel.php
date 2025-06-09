<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class categoriaModel extends Model
{
    use HasFactory;

    public $timestamps = false; 
    public $table = 'categoria';
    public $primaryKey = 'id_categoria';
    public $fillable = [
        'id_categoria',
        'nombre'
    ];

    public function productos()
    {
        return $this->hasMany('App\Models\productoModel', 'id_categoria', 'id_categoria');
    }
}
