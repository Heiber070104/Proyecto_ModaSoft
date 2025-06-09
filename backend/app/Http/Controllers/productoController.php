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
            $productos = productoModel::join("categoria", "producto.id_categoria", "=", "categoria.id_categoria")
                ->join("talla", "producto.id_talla", "=", "talla.id_talla")
                ->join("inventario", "producto.id_producto", "=", "inventario.id_producto")    
                ->select("producto.*", "categoria.nombre as categoria", "talla.descripcion as talla", "inventario.cantidad_disponible as cantidad")
            ->get();

            return response()->json($productos);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al consultar productos: ' . $e->getMessage()], 500);
        }
    }

    public function buscarProducto(Request $request, $id)
    {
        // Lógica para buscar un producto por ID
        try {
            $producto = productoModel::join("categoria", "producto.id_categoria", "=", "categoria.id_categoria")
                ->join("talla", "producto.id_talla", "=", "talla.id_talla")
                ->join("inventario", "producto.id_producto", "=", "inventario.id_producto")
                ->select("producto.*", "categoria.nombre as categoria", "talla.descripcion as talla", "inventario.cantidad_disponible as cantidad")
                ->where('producto.id_producto', $id)
            ->first();

            if (!$producto) {
                return response()->json(['message' => 'Producto no encontrado'], 404);
            }

            return response()->json($producto);
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
                'id_categoria' => 'required|integer',
                'id_talla' => 'required|integer',
                'cantidad' => 'required|integer|min:0'
            ]);

            $producto = productoModel::create([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'],
                'precio_unitario' => $data['precio'],
                'id_categoria' => $data['id_categoria'],
                'id_talla' => $data['id_talla']
            ]);

            $inventario = inventarioModel::create([
                'id_producto' => $producto->id_producto,
                'cantidad_disponible' => $data['cantidad']
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
            'id_categoria' => 'required|integer',
            'id_talla' => 'required|integer',
            'cantidad' => 'required|integer|min:0'
        ]);

        try{
            $producto = productoModel::findOrFail($id);
            $producto->update([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'],
                'precio_unitario' => $data['precio'],
                'id_categoria' => $data['id_categoria'],
                'id_talla' => $data['id_talla']
            ]);

            $inventario = inventarioModel::where('id_producto', $id)->first();
            if ($inventario) {
                $inventario->update(['cantidad_disponible' => $data['cantidad']]);
            } else {
                inventarioModel::create([
                    'id_producto' => $producto->id_producto,
                    'cantidad_disponible' => $data['cantidad']
                ]);
            }

            return response()->json(['message' => 'Producto actualizado exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar producto: ' . $e->getMessage()], 500);
        }
    }

    public function eliminarProducto(Request $request, $id)
    {
        // Lógica para eliminar un producto por ID
        try {

            $producto = productoModel::findOrFail($id);
            $producto->delete();

            // Eliminar el inventario asociado

            return response()->json(['message' => 'Producto eliminado exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar producto: ' . $e->getMessage()], 500);
        }
    }
}
