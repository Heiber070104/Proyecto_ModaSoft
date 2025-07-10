<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\compraModel;

class cuentasPagarModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = "cuentas_pagar";
    public $primaryKey = "id_cuenta_pagar";
    public $fillable = [
        "id_compra",
        "monto_total",
        "monto_pagado",
        "fecha",
        "estado"
    ];

    public function compra(){
        return $this->hasOne(compraModel::class, "id_compra", "id_compra");
    }

}
