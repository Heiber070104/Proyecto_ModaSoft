<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class inventarioModel extends Model
{
    use HasFactory;

    public $timestamps = false; 
    public $table = 'inventario';
    public $primaryKey = 'id_inventario';
    public $fillable = [  
        'id_inventario',
        'id_producto',
        'cantidad_disponible'
    ];
}
