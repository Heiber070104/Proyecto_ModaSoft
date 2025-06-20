<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\compraModel;

class proveedorModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'proveedor';    
    public $primaryKey = 'id_proveedor';
    public $fillable = [
        'nombre',
        'telefono',
        'direccion',
        'correo'
    ];

    public function compras()
    {
        return $this->hasMany(compraModel::class, 'id_proveedor', 'id_proveedor');
    }
}
