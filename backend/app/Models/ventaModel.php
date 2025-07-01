<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\productoModel;
use App\Models\clienteModel;

class ventaModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'venta';
    public $primaryKey = "id_venta";
    public $fillable = [
        'factura',
        'fecha',
        "id_cliente",
        "total",
        "estado"
    ];

    public function cliente(){
        return $this->belongsTo(clienteModel::class, "id_cliente", "id_cliente");
    }

    public function producto(){
        return $this->belongsToMany(productoModel::class, "detalle_venta", "id_venta", "id_producto")
            ->withPivot("cantidad", "precio_venta");
    }
}
