<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\tallaModel;
use App\Models\productoModel;

class categoriaModel extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false; 
    public $table = 'categoria';
    public $primaryKey = 'id_categoria';
    protected $dates = ["deleted_at"];
    public $fillable = [
        'id_categoria',
        'nombre'
    ];

    public function talla(){
        return $this->hasMany(tallaModel::class, "id_categoria", "id_categoria");
    }

    public function productos()
    {
        return $this->hasMany('App\Models\productoModel', 'id_categoria', 'id_categoria');
    }
}
