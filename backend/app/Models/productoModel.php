<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; //para borrado logico

use App\Models\proveedorModel;
use App\Models\compraModel;
use App\Models\ventaModel;
use App\Models\categoriaModel;
use App\Models\tallaModel;
use App\Models\inventarioModel;

class productoModel extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;
    public $table = 'producto';
    public $primaryKey = 'id_producto';

    protected $dates = ['deleted_at']; //para borrado logico
    public $fillable = [
        'nombre',
        'descripcion',
        'precio_unitario',
        'porcentaje_ganancia',
        'id_categoria',
        "id_talla",
        "id_proveedor"
    ];

    public function proveedor(){
        return $this->hasOne(proveedorModel::class, "id_proveedor", "id_proveedor");
    }

    public function categoria()
    {
        return $this->hasOne(categoriaModel::class, 'id_categoria', 'id_categoria');
    }

    public function talla()
    {
        return $this->hasOne(tallaModel::class, 'id_talla', 'id_talla');
    }

    public function inventario()
    {
        return $this->hasOne(inventarioModel::class, 'id_producto', 'id_producto');
    }

    public function compra(){
        return $this->belongsToMany(compraModel::class, 'detalle_compra', 'id_producto', 'id_compra')
                    ->withPivot('cantidad', 'precio_compra');
    }

    public function venta(){
        return $this->belongsToMany(ventaModel::class, "detalle_compra", "id_producto", "id_venta")
            ->withPivot("cantidad", "precio_venta");
    }
}
