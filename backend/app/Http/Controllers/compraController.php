<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\compraModel;
use App\Models\inventarioModel;
use App\Models\productoModel;
use App\Models\cuentasPagarModel;
use App\Models\transaccionModel;
use App\Models\pagoCompraModel;
use Codedge\Fpdf\Fpdf\Fpdf;


class compraController extends Controller
{

   public function consultarTodo(){

        try{

            $compras = compraModel::with("proveedor")->with("producto")->get();
            return response()->json($compras, 200);
        
        }catch(Exception $e){
            return response()->json(['message' => 'Error en la consulta: ' . $e->getMessage()], 500);
        }

   } 


   public function crearCompra(Request $request)
   {
        try{
         // Validar los datos de la solicitud
            $data = $request->validate([
                'fecha_vence' => 'required|date',
                'id_proveedor' => 'required|integer',
                'tipo_pago' => 'required|string',
            ]);

            $compra = compraModel::create([
                'fecha_creada' => now(),
                'fecha_vence' => $data["fecha_vence"],
                'id_proveedor' => $data['id_proveedor'],
                'total' => 0,
                'tipo_pago' => $data['tipo_pago'],
                'estado' => "por confirmar",
                "estado_despacho" => "pendiente"
            ]);

            $total = 0;

            foreach ($request->productos as $producto) {

                if(!$producto["id_producto"] || !$producto["cantidad"] || !$producto["precio_compra"]){
                    $compra->delete();
                    return response()->json(["message" => "Solicitud incorrecta: Faltan datos de productos"], 400);
                }

                $compra->producto()->attach($producto['id_producto'], [
                    'cantidad' => $producto['cantidad'],
                    'precio_compra' => $producto['precio_compra'],
                ]);

                $total += $producto['precio_compra'];

            }

            $compra->factura = "F-".str_pad($compra->id_compra, 8, "0", STR_PAD_LEFT);
            $compra->total = $total;
            $compra->save();

            return response()->json(['message' => 'Compra creada exitosamente'], 201);

        }catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear la compra: ' . $e->getMessage()], 500);
        }
    }

    public function completarCompra(Request $request, $id){

        try{

            $data = $request->validate([
                'metodo_pago' => 'nullable|string',
            ]);
            
            if(!$id){
                return response()->json(['message' => 'ID de compra no proporcionado'], 400);
            }

            $compra = compraModel::find($id);
            if (!$compra) { 
                return response()->json(['message' => 'Compra no encontrada'], 404);
            }

            if($compra->tipo_pago === "CONTADO"){

                $pago = new pagoCompraModel();
                $pago->id_compra = $compra->id_compra;
                $pago->monto = $compra->total;
                $pago->fecha = now();
                $pago->metodo = $data["metodo_pago"] ?? 'EFECTIVO'; // Asignar un método de pago por defecto si no se proporciona
                $pago->save();

                $transaccionDebito = new transaccionModel();
                $transaccionDebito->factura = "F-".str_pad($compra->id_compra, 8, "0", STR_PAD_LEFT);
                $transaccionDebito->descripcion = "Compra al contado según factura ".str_pad($compra->id_compra, 8, "0", STR_PAD_LEFT)." por monto de Bs " . number_format($compra->total, 2);
                $transaccionDebito->fecha = now();
                $transaccionDebito->monto = $compra->total;
                $transaccionDebito->tipo = 'DEBITO';
                $transaccionDebito->id_cuenta = 80;// Asumiendo que la cuenta de compras es la cuenta 3 y caja es la cuenta 1
                $transaccionDebito->save();

                $transaccionCredito = new transaccionModel();
                $transaccionCredito->factura = "F-".str_pad($compra->id_compra, 8, "0", STR_PAD_LEFT);
                $transaccionCredito->descripcion = "Compra al contado según factura F-".str_pad($compra->id_compra, 8, "0", STR_PAD_LEFT)." por monto de Bs " . number_format($compra->total, 2);
                $transaccionCredito->fecha = now();
                $transaccionCredito->monto = $compra->total;
                $transaccionCredito->tipo = 'CREDITO';
                $transaccionCredito->id_cuenta = ($data["metodo_pago"] == "EFECTIVO") ? 1 : 3; 
                $transaccionCredito->save();

            }else{

                $transaccionDebito = new transaccionModel();
                $transaccionDebito->factura = "F-".str_pad($compra->id_compra, 8, "0", STR_PAD_LEFT);
                $transaccionDebito->descripcion = "Compra a crédito según factura F-".str_pad($compra->id_compra, 8, "0", STR_PAD_LEFT). " por monto de Bs " . number_format($compra->total, 2);
                $transaccionDebito->fecha = now();
                $transaccionDebito->monto = $compra->total;
                $transaccionDebito->tipo = 'DEBITO';
                $transaccionDebito->id_cuenta = 80;
                $transaccionDebito->save();

                $transaccionCredito = new transaccionModel();
                $transaccionCredito->factura = "F-".str_pad($compra->id_compra, 8, "0", STR_PAD_LEFT);
                $transaccionCredito->descripcion = "Compra a crédito según factura F-".str_pad($compra->id_compra, 8, "0", STR_PAD_LEFT). " por monto de Bs " . number_format($compra->total, 2);
                $transaccionCredito->fecha = now();
                $transaccionCredito->monto = $compra->total;
                $transaccionCredito->tipo = 'CREDITO';
                $transaccionCredito->id_cuenta = 51;
                $transaccionCredito->save();

                $cuentaPagar = cuentasPagarModel::create([
                    'id_compra' => $compra->id_compra,
                    'monto_total' => $compra->total,
                    'monto_pagado' => 0,
                    'fecha' => now(),
                    'estado' => 'pendiente',
                ]);

            }

            $compra->estado = 'confirmada';
            $compra->save();

            return response()->json(['message' => 'Compra completada exitosamente, existencias actualizadas'], 200);

        }catch(\Exception $e){
            return response()->json(['message' => 'Error al completar compra: ' . $e->getMessage()], 500);

        }

    }

    public function cancelarCompra(Request $request, $id){
        try {
            $compra = compraModel::find($id);
            if (!$compra) {
                return response()->json(['message' => 'Compra no encontrada'], 404);
            }
            $compra->estado = 'cancelada';
            $compra->estado_despacho = 'cancelado';
            $compra->save();
            return response()->json(['message' => 'Compra cancelada exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cancelar la compra: ' . $e->getMessage()], 500);
        }
    }

    public function confirmarDespacho(Request $request, $id){
        try{
            if (!$id) {
                return response()->json(['message' => 'ID de compra no proporcionado'], 400);
            }
            $compra = compraModel::find($id);
            if (!$compra){
                return response()->json(['message' => 'Compra no encontrada'], 404);
            }
            $productos = $compra->producto->toArray();

            foreach ($productos as $producto) {
                $stock = inventarioModel::where("id_producto", $producto["id_producto"])->first();
                $stock->cantidad_disponible += $producto["pivot"]["cantidad"];
                $stock->save();
            }
            $compra->estado_despacho = 'completado';
            $compra->save();

            return response()->json(['message' => 'Despacho confirmado exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al confirmar el despacho: ' . $e->getMessage()], 500);
        }
    }

    public function consultarDeudas(Request $request, $id = null){
        try {

            if ($id) {
                $deuda = cuentasPagarModel::with('compra.proveedor')->find($id);
                if (!$deuda) {
                    return response()->json(['message' => 'Deuda no encontrada'], 404);
                }
                return response()->json($deuda, 200);
            }

            $deudas = cuentasPagarModel::with("compra.proveedor")->get();
            return response()->json($deudas, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al consultar deudas: ' . $e->getMessage()], 500);
        }
    }

    public function pagarDeuda(Request $request, $id){

        try {
            $data = $request->validate([
                'monto_pagado' => 'required|numeric',
                'metodo' => 'required|string',
            ]);

            $cuentaPagar = cuentasPagarModel::find($id);
            if (!$cuentaPagar) {
                return response()->json(['message' => 'Cuenta por pagar no encontrada'], 404);
            }

            $pago = pagoCompraModel::create([
                'id_compra' => $cuentaPagar->id_compra,
                'monto' => $data['monto_pagado'],
                'fecha' => now(),
                'metodo' => $data['metodo'],
            ]);

            $pagos = pagoCompraModel::where('id_compra', $cuentaPagar->id_compra)->get();
            $totalPagado = $pagos->sum('monto');
            $cuentaPagar->monto_pagado = $totalPagado;
            
            if ($totalPagado >= $cuentaPagar->monto_total) {
                $cuentaPagar->monto_pagado = $cuentaPagar->monto_total; // Asegurarse de no exceder el total
                $cuentaPagar->estado = 'pagado';
            }

            $cuentaPagar->save();

            $transaccionDebito = new transaccionModel();
            $transaccionDebito->factura = "F-".str_pad($cuentaPagar->id_compra, 8, "0", STR_PAD_LEFT);
            $transaccionDebito->descripcion = "Pago de deuda por compra según F-".str_pad($cuentaPagar->id_compra, 8, "0", STR_PAD_LEFT). " por monto de Bs " . number_format($data['monto_pagado'], 2);
            $transaccionDebito->fecha = now();
            $transaccionDebito->monto = $data['monto_pagado'];
            $transaccionDebito->tipo = 'DEBITO';
            $transaccionDebito->id_cuenta = 51; // Asumiendo que la cuenta de caja es la cuenta 1 y la cuenta bancaria es la cuenta 3
            $transaccionDebito->save();

            $transaccionCredito = new transaccionModel();
            $transaccionCredito->factura = "F-".str_pad($cuentaPagar->id_compra, 8, "0", STR_PAD_LEFT);
            $transaccionCredito->descripcion = "Pago de deuda por compra según F-".str_pad($cuentaPagar->id_compra, 8, "0", STR_PAD_LEFT). " por monto de Bs " . number_format($data['monto_pagado'], 2);
            $transaccionCredito->fecha = now();
            $transaccionCredito->monto = $data['monto_pagado'];
            $transaccionCredito->tipo = 'CREDITO';
            $transaccionCredito->id_cuenta = ($data['metodo'] == "EFECTIVO") ? 1 : 3; // Asumiendo que la cuenta de caja es la cuenta 1 y la cuenta bancaria es la cuenta 3
            $transaccionCredito->save();

            return response()->json(['message' => 'Pago registrado exitosamente'], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al registrar el pago: ' . $e->getMessage()], 500);
        }
    }

    // funcion PDF
    public function generarPDF($id){
        $compra = compraModel::with(['proveedor', 'producto'])->findOrFail($id);

        $pdf = new Fpdf();
        $pdf->AddPage();

        $pdf->setTitle('Detalle de Compra #' . $compra->id_compra);


        // Colores y fuentes
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->SetTextColor(75, 46, 131); // Color morado #4B2E83

        // Logo
        $logoPath = base_path('../frontend/public/logo_modasoft_N.png');
        if (file_exists($logoPath)) {
            $pdf->Image($logoPath, 5, 1, 50); // X, Y, tamaño
        }

        $pdf->Cell(0, 18, 'Detalle de Compra #' . $compra->id_compra, 0, 1, 'C');
        $pdf->Ln(20);

        // Datos generales
        $pdf->SetFont('Arial', '', 14);
        $pdf->SetTextColor(0);

        $pdf->Cell(0, 8, 'Proveedor: ' . $compra->proveedor->nombre, 0, 1);
        $pdf->Cell(0, 8, 'Fecha creada: ' . $compra->fecha_creada, 0, 1);
        $pdf->Cell(0, 8, 'Fecha despacho: ' . $compra->fecha_vence, 0, 1);
        $pdf->Cell(0, 8, 'Estado: ' . ucfirst($compra->estado), 0, 1);
        $pdf->Ln(8);

        // Tabla productos
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetFillColor(75, 46, 131); // Morado
        $pdf->SetTextColor(255);

        $pdf->Cell(70, 8, 'Producto', 1, 0, 'C', true);
        $pdf->Cell(30, 8, 'Cantidad', 1, 0, 'C', true);
        $pdf->Cell(40, 8, 'Precio Unitario', 1, 0, 'C', true);
        $pdf->Cell(40, 8, 'Subtotal', 1, 1, 'C', true);

        $pdf->SetFont('Arial', '', 11);
        $pdf->SetTextColor(0);

        foreach ($compra->producto as $producto) {
            $pdf->Cell(70, 8, utf8_decode($producto->nombre), 1);
            $pdf->Cell(30, 8, $producto->pivot->cantidad, 1, 0, 'C');
            $pdf->Cell(40, 8, number_format($producto->precio_unitario, 2), 1, 0, 'R');
            $pdf->Cell(40, 8, number_format($producto->pivot->precio_compra, 2), 1, 1, 'R');
        }

        // Total
        $pdf->Ln(3);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, 'Total General: Bs ' . number_format($compra->total, 2), 0, 1, 'R');

        // Firma
        $pdf->Ln(20);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(60, 8, '__________________________', 0, 0, 'C');
        $pdf->Cell(60, 8, '__________________________', 0, 0, 'C');
        $pdf->Cell(60, 8, '__________________________', 0, 1, 'C');

        $pdf->Cell(60, 6, 'Receptor', 0, 0, 'C');
        $pdf->Cell(60, 6, 'Almacenista', 0, 0, 'C');
        $pdf->Cell(60, 6, 'Supervisor', 0, 1, 'C');

        $pdf->Output();
        exit;
    }   

}