<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ventaModel;

class clienteModel extends Model
{
    use HasFactory;

    public $timespamp = false;
    public $table = "cliente";
    public $primaryKey = "id_cliente";
    
    protected $dates = ["deleted_at"];
    public $fillable = [
        "cedula",
        "nombre",
        "direccion",
        "telefono",
        "correo"
    ];

    public function venta(){
        return $this->hasMany(ventaModel::class, "id_cliente", "id_cliente");
    }

}
