<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ventaModel;
use App\Models\detalleventaModel;

class devolucionesModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'devolucion';
    public $primaryKey = 'id_devolucion';

    protected $fillable = [
        'id_venta',
        'id_detalle_venta',
        'fecha',
        'motivo',
        "monto",
        'cantidad',
        "estado_mercancia",
        'estado',
    ];

    public function venta(){
        return $this->belongsTo(ventaModel::class, 'id_venta', 'id_venta');
    }

    public function detalle(){
        return $this->belongsTo(detalleventaModel::class, 'id_detalle_venta', 'id_detalle_venta');
    }
}
