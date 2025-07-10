<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\compraModel;
use App\Models\inventarioModel;
use App\Models\productoModel;
use App\Models\cuentasPagarModel;
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
                'total' => 'required|numeric',
                'estado' => 'required|string',
            ]);

            $compra = compraModel::create([
                'fecha_creada' => now(),
                'fecha_vence' => $data["fecha_vence"],
                'id_proveedor' => $data['id_proveedor'],
                'total' => $data['total'],
                'estado' => $data['estado'],
            ]);

            foreach ($request->productos as $producto) {

                if(!$producto["id_producto"] || !$producto["cantidad"] || !$producto["precio_compra"]){
                    $compra->delete();
                    return response()->json(["message" => "Solicitud incorrecta: Faltan datos de productos"], 400);
                }

                $compra->producto()->attach($producto['id_producto'], [
                    'cantidad' => $producto['cantidad'],
                    'precio_compra' => $producto['precio_compra'],
                ]);

            }

            return response()->json(['message' => 'Compra creada exitosamente'], 201);

        }catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear la compra: ' . $e->getMessage()], 500);
        }
    }

    public function completarCompra(Request $request, $id){

        try{
            
            if(!$id){
                return response()->json(['message' => 'ID de compra no proporcionado'], 400);
            }

            $compra = compraModel::find($id);
            if (!$compra) { 
                return response()->json(['message' => 'Compra no encontrada'], 404);
            }

            $productos = $compra->producto->toArray();

            foreach ($productos as $producto) {
                $stock = inventarioModel::where("id_producto", $producto["id_producto"])->first();
                $stock->cantidad_disponible += $producto["pivot"]["cantidad"];
                $stock->save();
            }

            $compra->estado = 'procesada';
            $compra->save();

            // Crear la cuenta por pagar
            $cuentaPagar = cuentasPagarModel::create([  
                'id_compra' => $compra->id_compra,
                'monto_total' => $compra->total,
                'monto_pagado' => 0, // Inicialmente no se ha pagado nada
                'fecha_vencimiento' => now()->addDays(15), // Fecha de vencimiento 30 días después
                'estado' => 'pendiente',
            ]);

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
            $compra->save();
            return response()->json(['message' => 'Compra cancelada exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cancelar la compra: ' . $e->getMessage()], 500);
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
            ]);

            $cuentaPagar = cuentasPagarModel::find($id);
            if (!$cuentaPagar) {
                return response()->json(['message' => 'Cuenta por pagar no encontrada'], 404);
            }

            $cuentaPagar->monto_pagado += $data['monto_pagado'];
            if ($cuentaPagar->monto_pagado >= $cuentaPagar->monto_total) {
                $cuentaPagar->monto_pagado = $cuentaPagar->monto_total; // Asegurarse de no exceder el total
                $cuentaPagar->estado = 'pagado';
            }
            $cuentaPagar->save();

            return response()->json(['message' => 'Pago registrado exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al registrar el pago: ' . $e->getMessage()], 500);
        }
    }
     public function filtrarCompras(Request $request)
{
    try {
        $tipo = $request->input('tipo');

        switch ($tipo) {
            case 'fecha':
                $inicio = $request->input('inicio');
                $fin = $request->input('fin');
                $compras = compraModel::with('proveedor', 'producto')
                    ->whereBetween('fecha_creada', [$inicio, $fin])
                    ->get();
                break;

            case 'estado':
                $estado = $request->input('estado');
                $compras = compraModel::with('proveedor', 'producto')
                    ->where('estado', $estado)
                    ->get();
                break;

            case 'proveedor':
                $proveedor = $request->input('proveedor');
                $compras = compraModel::with('proveedor', 'producto')
                    ->whereHas('proveedor', function ($q) use ($proveedor) {
                        $q->where('nombre', 'LIKE', '%' . $proveedor . '%');
                    })
                    ->get();
                break;

            default:
                return response()->json(['message' => 'Tipo de filtro no válido'], 400);
        }

        return response()->json($compras, 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al filtrar compras: ' . $e->getMessage()], 500);
    }
}

    // funcion PDF
    public function generarPDF($id){
        $compra = compraModel::with(['proveedor', 'producto'])->findOrFail($id);

        $pdf = new Fpdf();
        $pdf->AddPage();

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