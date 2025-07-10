<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\cuentaContableModel;

class transaccionModel extends Model
{
    use HasFactory;

    public $table = "transacciones";
    public $timestamps = false;
    public $primaryKey = 'id_transaccion';
    protected $fillable = [
        'factura',
        'fecha', 
        'id_cuenta', 
        'monto', 
        'tipo'
    ];

    // Relación con cuenta contable
    public function cuentaContable()
    {
        return $this->belongsTo(cuentaContableModel::class, 'id_cuenta', 'id_cuenta');
    }
}
