<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\compraModel;

class productoModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'producto';
    public $primaryKey = 'id_producto';
    public $fillable = [
        'nombre',
        'descripcion',
        'precio_unitario',
        'id_categoria',
        "id_talla"
    ];

    public function categoria()
    {
        return $this->belongsTo('App\Models\categoriaModel', 'id_categoria', 'id_categoria');
    }

    public function talla()
    {
        return $this->belongsTo('App\Models\tallaModel', 'id_talla', 'id_talla');
    }

    public function inventario()
    {
        return $this->hasOne('App\Models\inventarioModel', 'id_producto', 'id_producto');
    }

    public function compras()
    {
        return $this->belongsToMany(compraModel::class, 'detalle_compra', 'id_producto', 'id_compra')
                    ->withPivot('cantidad', 'precio_compra');
    }
  
}
