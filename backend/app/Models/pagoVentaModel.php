<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ventaModel;

class pagoVentaModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'pago_venta';
    public $primaryKey = "id_pago_venta";
    public $fillable = [
        'id_venta',
        'fecha',
        'monto',
        'metodo'
    ];

    public function venta()
    {
        return $this->belongsTo(ventaModel::class, 'id_venta', 'id_venta');
    }
}
