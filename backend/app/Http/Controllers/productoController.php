<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\productoModel;
use App\Models\inventarioModel;

class productoController extends Controller
{
    public function consultarTodo(Request $request)
    {
        // Lógica para consultar todos los productos
        try {

            $productos = productoModel::with("categoria")->with("talla")->with("proveedor")->with("inventario")->get();
            return response()->json($productos);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al consultar productos: ' . $e->getMessage()], 500);
        }
    }

    public function buscarProducto(Request $request, $id)
    {
        // Lógica para buscar un producto por ID
        try {

            $producto = productoModel::with("categoria")->with("talla")->with("proveedor")->with("inventario")->find($id);

            if (!$producto) {
                return response()->json(['message' => 'Producto no encontrado'], 404);
            }

            return response()->json($producto, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al buscar producto: ' . $e->getMessage()], 500);
        }
    }

    public function crearProducto(Request $request)
    {
        // Lógica para crear un nuevo producto
        try {

            $data = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'precio' => 'required|numeric|min:0',
                'porcentaje' => 'required|numeric|min:0',
                'id_categoria' => 'required|integer',
                'id_talla' => 'required|integer',
                'id_proveedor' => 'required|integer'
            ]);

            $producto = productoModel::create([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'],
                'precio_unitario' => $data['precio'],
                'porcentaje_ganancia' => $data["porcentaje"],
                'id_categoria' => $data['id_categoria'],
                'id_talla' => $data['id_talla'],
                'id_proveedor' => $data["id_proveedor"]
            ]);

            $inventario = inventarioModel::create([
                'id_producto' => $producto->id_producto,
                'cantidad_disponible' => 0
            ]);

            return response()->json(['message' => 'Producto creado exitosamente'], 201);
             
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear producto: ' . $e->getMessage()], 500);
        }
    }

    public function actualizarProducto(Request $request, $id)
    {
        // Lógica para actualizar un producto existente

        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'porcentaje' => 'required|numeric|min:0'
        ]);

        try{
            $producto = productoModel::findOrFail($id);
            $producto->update([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'],
                'precio_unitario' => $data['precio'],
                'porcentaje_ganancia' => $data["porcentaje"],
            ]);

            return response()->json(['message' => 'Producto actualizado exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar producto: ' . $e->getMessage()], 500);
        }
    }

public function eliminarProducto(Request $request, $id)
{
    try {
        $producto = productoModel::findOrFail($id);

        // Aplicamos SoftDelete (borrado lógico)
        $producto->delete();

        return response()->json(['message' => 'Producto eliminado exitosamente.'], 200);
        /*
        // Si en el futuro se desea restaurar:
        if ($producto->trashed()) {
            $producto->restore();
        }
        */
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al eliminar producto: ' . $e->getMessage()], 500);
    }
}


}
