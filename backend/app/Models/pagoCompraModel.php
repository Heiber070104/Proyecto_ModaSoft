<?php

namespace App\Models;
use App\Models\compraModel;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class pagoCompraModel extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'pago_compra';
    public $primaryKey = "id_pago_compra";
    public $fillable = [
        'id_compra',
        'fecha',
        'monto',
        'metodo'
    ];

    public function compra()
    {
        return $this->belongsTo(compraModel::class, 'id_compra', 'id_compra');
    }
}
