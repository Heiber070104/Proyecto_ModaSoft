<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ventaModel;

class cuentasCobrarModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = "cuentas_cobrar";
    public $primaryKey = "id_cuenta_cobrar";
    public $fillable = [
        "id_venta",
        "monto_total",
        "monto_pagado",
        "fecha",
        "estado"
    ];

    public function venta(){
        return $this->hasOne(ventaModel::class, "id_venta", "id_venta");
    }

}
