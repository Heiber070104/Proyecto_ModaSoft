<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\productoModel;
use App\Models\ventaModel;
use App\Models\devolucionesModel;


class detalleventaModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'detalle_venta';
    protected $primaryKey = 'id_detalle_venta';

    protected $fillable = [
        'id_venta',
        'id_producto',
        'cantidad',
        'precio_venta',
    ];

    public function venta()
    {
        return $this->belongsTo(ventaModel::class, 'id_venta', 'id_venta');
    }

    public function producto()
    {
    return $this->belongsTo(productoModel::class, 'id_producto');
    }


    public function devoluciones()
    {
        return $this->hasMany(devolucionesModel::class, 'id_detalle_venta', 'id_detalle_venta');
    }
}
