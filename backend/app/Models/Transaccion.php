<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaccion extends Model
{
    use HasFactory;

    protected $fillable = ['fecha', 'id_cuenta', 'monto', 'tipo'];

    // Relación con cuenta contable
    public function cuentaContable()
    {
        return $this->belongsTo(CuentaContable::class, 'id_cuenta');
    }
}
