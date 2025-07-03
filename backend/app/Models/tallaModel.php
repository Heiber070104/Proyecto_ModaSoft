<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\categoriaModel;
use App\Models\productoModel;

class tallaModel extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;
    public $table = 'talla';
    public $primaryKey = 'id_talla';

    protected $dates = ["deleted_at"];
    public $fillable = [
        'id_categoria', 
        'descripcion'
    ];

    public function categoria(){
        return $this->hasOne(categoriaModel::class, "id_categoria", "id_categoria");
    }

    public function productos()
    {
        return $this->hasMany(productoModel::class, 'id_talla', 'id_talla');
    }
}
