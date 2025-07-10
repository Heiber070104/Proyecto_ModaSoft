<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\devolucionesModel;
use App\Models\detalleventaModel;
use Illuminate\Support\Facades\DB;

class devolucionesController extends Controller
{
    // 📥 Registrar nueva devolución
    public function registrar(Request $request)
    {
        try {
            $data = $request->validate([
                'id_venta' => 'required|integer|exists:venta,id_venta',
                'id_detalle_venta' => 'required|integer|exists:detalle_venta,id_detalle_venta',
                'motivo' => 'required|string',
                'cantidad' => 'required|integer|min:1',
                'fecha' => 'required|date',
            ]);

            $detalle = detalleventaModel::findOrFail($data['id_detalle_venta']);
            $cantidadVendida = $detalle->cantidad;
            $cantidadDevuelta = devolucionesModel::where('id_detalle_venta', $detalle->id_detalle_venta)->sum('cantidad');

            if (($cantidadDevuelta + $data['cantidad']) > $cantidadVendida) {
                return response()->json(['message' => 'Cantidad a devolver excede lo vendido.'], 422);
            }

            devolucionesModel::create([
                'id_venta' => $data['id_venta'],
                'id_detalle_venta' => $data['id_detalle_venta'],
                'motivo' => $data['motivo'],
                'cantidad' => $data['cantidad'],
                'fecha' => $data['fecha'],
                'estado' => 'pendiente'
            ]);

            return response()->json(['message' => 'Devolución registrada correctamente'], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al registrar devolución: ' . $e->getMessage()], 500);
        }
    }

    // 📋 Listar todas las devoluciones con información relacionada
    public function listarDevoluciones()
    {
        try {
            $devoluciones = devolucionesModel::with(['venta.cliente', 'detalle.producto.talla'])
                ->orderBy('fecha', 'DESC')
                ->get();

            $formateadas = $devoluciones->map(function ($dev) {
                return [
                    'id_devolucion' => $dev->id_devolucion,
                    'fecha' => $dev->fecha,
                    'estado' => $dev->estado,
                    'motivo' => $dev->motivo,
                    'cantidad' => $dev->cantidad,
                    'venta' => [
                        'factura' => $dev->venta->factura,
                        'cliente' => $dev->venta->cliente->nombre ?? '',
                    ],
                    'producto' => [
                        'nombre' => $dev->detalle->producto->nombre ?? '',
                        'talla' => $dev->detalle->producto->talla->descripcion ?? ''
                    ]
                ];
            });

            return response()->json(['devoluciones' => $formateadas]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al consultar devoluciones: ' . $e->getMessage()], 500);
        }
    }

    // 🔁 Cambiar estado de una devolución y reponer stock si es aceptada
public function cambiarEstado(Request $request, $id)
{
    try {
        $data = $request->validate([
            'estado' => 'required|in:pendiente,aceptada,rechazada'
        ]);

        $devolucion = devolucionesModel::with('detalle.producto.inventario')->findOrFail($id);
        $devolucion->estado = $data['estado'];
        $devolucion->save();

        // ✅ Reponer stock si se acepta la devolución
        if ($data['estado'] === 'aceptada') {
            $inventario = $devolucion->detalle->producto->inventario;
            if ($inventario) {
                $inventario->cantidad_disponible += $devolucion->cantidad;
                $inventario->save();
            }
        }

        return response()->json(['message' => 'Estado actualizado con éxito.']);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al actualizar estado: ' . $e->getMessage()], 500);
    }
}

}
