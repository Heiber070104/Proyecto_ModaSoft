<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tallaModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'talla';
    public $primaryKey = 'id_talla';
    public $fillable = [
        'id_talla', 
        'descripcion'
    ];

    public function productos()
    {
        return $this->hasMany('App\Models\productoModel', 'id_talla', 'id_talla');
    }
}
