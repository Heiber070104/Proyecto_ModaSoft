<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\productoModel;
use App\Models\devolucionesModel;
use App\Models\detalleventaModel;
use App\Models\ventaModel;
use App\Models\transaccionModel;
use App\Models\cuentasCobrarModel;
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
                "monto" => "required",
                "estado_mercancia" => "required|string",
                'fecha' => 'required|date'
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
                'monto' => $data["monto"],
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
            $devoluciones = devolucionesModel::with(['venta.cliente', 'detalle.producto'])
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
                        'talla' => $dev->detalle->producto->talla->descripcion ?? '',
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
    DB::beginTransaction();
    try {
        $data = $request->validate([
            'estado' => 'required|in:pendiente,aceptada,rechazada'
        ]);

        $devolucion = devolucionesModel::with('detalle.producto.inventario')->findOrFail($id);
        $devolucion->estado = $data['estado'];
        $devolucion->save();

        if($data["estado"] == "rechazada"){
            return response()->json(["message"=>"Devolucion rechazada exitosamente"], 200);
        }

        // ✅ Reponer stock si se acepta la devolución
        if ($data['estado'] === 'aceptada' && $devolucion->estado_mercancia == "BUENO") {
            $inventario = $devolucion->detalle->producto->inventario;
            if ($inventario) {
                $inventario->cantidad_disponible += $devolucion->cantidad;
                $inventario->save();
            }
        }

        $venta = ventaModel::findOrFail($devolucion->id_venta);

        if($venta->tipo_pago === "CONTADO"){

            $transaccionDebito = new transaccionModel();
            $transaccionDebito->factura = "F-".str_pad($venta->id_venta, 8, "0", STR_PAD_LEFT);

            $transaccionDebito->descripcion  = 
                "Devolución de mercacia de venta al contado según F-".
                str_pad($venta->id_venta, 8, "0", STR_PAD_LEFT).
                " por monto de Bs ". 
                number_format($devolucion->monto, 2).
                " por parte del cliente ". 
                $venta->cliente->nombre.
                " pagado con efectivo" 
            ;

            $transaccionDebito->fecha = now();
            $transaccionDebito->monto = $venta->total;
            $transaccionDebito->tipo = 'DEBITO';
            $transaccionDebito->id_cuenta = 69;
            $transaccionDebito->save();


            $transaccionCredito = new transaccionModel();
            $transaccionCredito->factura = "F-".str_pad($venta->id_venta, 8, "0", STR_PAD_LEFT);

            $transaccionCredito->descripcion  = 
                "Devolución de mercacia de venta al contado según F-".
                str_pad($venta->id_venta, 8, "0", STR_PAD_LEFT).
                " por monto de Bs ". 
                number_format($devolucion->monto, 2).
                " por parte del cliente ". 
                $venta->cliente->nombre.
                " pagado con efectivo"  
            ;

            $transaccionCredito->fecha = now();
            $transaccionCredito->monto = $venta->total;
            $transaccionCredito->tipo = 'CREDITO';
            $transaccionCredito->id_cuenta = 1;
            $transaccionCredito->save();

        }else{

            $transaccionDebito = new transaccionModel();
            $transaccionDebito->factura = "F-".str_pad($venta->id_venta, 8, "0", STR_PAD_LEFT);

            $transaccionDebito->descripcion  = 
                "Devolución de mercacia de venta a crédito según F-".
                str_pad($venta->id_venta, 8, "0", STR_PAD_LEFT).
                " por monto de Bs ". 
                number_format($devolucion->monto, 2).
                " por parte del cliente ". 
                $venta->cliente->nombre.
                " pagado con efectivo" 
            ;

            $transaccionDebito->fecha = now();
            $transaccionDebito->monto = $venta->total;
            $transaccionDebito->tipo = 'DEBITO';
            $transaccionDebito->id_cuenta = 69;
            $transaccionDebito->save();


            $transaccionCredito = new transaccionModel();
            $transaccionCredito->factura = "F-".str_pad($venta->id_venta, 8, "0", STR_PAD_LEFT);

            $transaccionCredito->descripcion  = 
                "Devolución de mercacia de venta a crédito según F-".
                str_pad($venta->id_venta, 8, "0", STR_PAD_LEFT).
                " por monto de Bs ". 
                number_format($devolucion->monto, 2).
                " por parte del cliente ". 
                $venta->cliente->nombre.
                " pagado con efectivo"  
            ;

            $transaccionCredito->fecha = now();
            $transaccionCredito->monto = $venta->total;
            $transaccionCredito->tipo = 'CREDITO';
            $transaccionCredito->id_cuenta = 5;
            $transaccionCredito->save();

            $cuentaCobrar = cuentasCobrarModel::where("id_venta", $venta->id_venta)->first();
            $cuentaCobrar->monto_total -= $devolucion->monto;

            if($cuentaCobrar->monto_pagado > $cuentaCobrar->monto_total){
                $cuentaCobrar->monto_pagado = $cuentaCobrar_monto_total;
                $cuentaCobrar->estado = "cobrado";
            }

            $cuentaCobrar->save();

        }

        DB::commit();

        return response()->json(['message' => 'Estado actualizado con éxito.']);

    } catch (\Exception $e) {
        DB::rollback();
        return response()->json(['message' => 'Error al actualizar estado: ' . $e->getMessage()], 500);
    }
}

}
