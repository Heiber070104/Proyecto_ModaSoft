<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\productoModel;
use App\Models\clienteModel;
use App\Models\devolucionesModel;

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

    public function producto()
    {
        return $this->belongsToMany(productoModel::class, 'detalle_venta', 'id_venta', 'id_producto')
            ->withPivot('id_detalle_venta', 'cantidad', 'precio_venta');
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
