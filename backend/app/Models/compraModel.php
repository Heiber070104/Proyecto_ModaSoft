<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\productoModel;
use App\Models\proveedorModel;
use App\Models\cuentasPagarModel;

use App\Models\pagoCompraModel;



class compraModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'compra';
    public $primaryKey = 'id_compra';
    public $fillable = [
        'fecha_creada',
        'fecha_vence',
        'id_proveedor',
        'tipo_pago',
        'estado_despacho',
        'total',
        'estado'
    ];

    public function proveedor(){
        return $this->belongsTo(proveedorModel::class, 'id_proveedor', 'id_proveedor');
    }


    public function pagoCompra(){
        return $this->hasMany(pagoCompraModel::class, 'id_compra', 'id_compra');
    }


    public function cuentasPagar(){
        return $this->hasOne(cuentasPagarModel::class, "id_compra", "id_compra");
    }

    public function producto(){
        return $this->belongsToMany(productoModel::class, "detalle_compra", 'id_compra', 'id_producto')
                    ->withPivot('cantidad', 'precio_compra');
    }

}
