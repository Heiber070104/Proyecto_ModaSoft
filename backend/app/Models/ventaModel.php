<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\productoModel;
use App\Models\clienteModel;
use App\Models\devolucionesModel;
use App\Models\pagoVentaModel;


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
        "tipo_pago",
        "estado"
    ];

    public function cliente(){
        return $this->belongsTo(clienteModel::class, "id_cliente", "id_cliente");
    }


    public function pagoVenta(){
        return $this->hasMany(pagoVentaModel::class, 'id_venta', 'id_venta');
    }

    public function producto(){
        return $this->belongsToMany(productoModel::class, "detalle_venta", "id_venta", "id_producto")
            ->withPivot("cantidad", "precio_venta");

    }

    public function devoluciones()
    {
        return $this->hasMany(devolucionesModel::class, 'id_venta', 'id_venta');
    }
public function detalles()
{
    return $this->hasMany(detalleVentaModel::class, 'id_venta', 'id_venta');
}

}
