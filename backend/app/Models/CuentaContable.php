<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CuentaContable extends Model
{
    use HasFactory;
    
    public $table = "cuentas_contables"

    protected $fillable = ['codigo', 'nombre', 'tipo'];

    // Relación con transacciones
    public function transacciones()
    {
        return $this->hasMany(Transaccion::class, 'id_cuenta');
    }
}
