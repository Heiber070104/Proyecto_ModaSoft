<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\productoModel;
use App\Models\proveedorModel;

class compraModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'compra';
    public $primaryKey = 'id_compra';
    public $fillable = [
        'id',
        'fecha',
        'id_proveedor',
        'total',
        'estado'
    ];

    public function proveedor(){
        return $this->belongsTo(proveedorModel::class, 'id_proveedor', 'id_proveedor');
    }

    public function producto (){
        return $this->belongsToMany(productoModel::class, "detalle_compra", 'id_compra', 'id_producto')
                    ->withPivot('cantidad', 'precio_compra');
    }

}
