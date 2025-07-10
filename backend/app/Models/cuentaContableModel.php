<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\transaccionModel;

class cuentaContableModel extends Model
{
    use HasFactory;
    
    public $table = "cuentas_contables";
    public $timestamps = false;
    public $primaryKey = 'id_cuenta';
    protected $fillable = ['codigo', 'nombre', 'tipo'];

    // Relación con transacciones
    public function transacciones()
    {
        return $this->hasMany(transaccionModel::class, 'id_cuenta', 'id_cuenta');
    }
}
