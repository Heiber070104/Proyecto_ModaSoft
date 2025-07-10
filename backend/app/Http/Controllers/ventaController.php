<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ventaModel;
use App\Models\productoModel;
use App\Models\inventarioModel;
use App\Models\tallaModel;
use App\Models\detalleventaModel;
use Codedge\Fpdf\Fpdf\Fpdf;

class ventaController extends Controller
{
    public function consultarTodo(Request $request){

        try{
            $ventas = ventaModel::with("cliente")->with("producto")->get();
            return response()->json($ventas, 200);
        }catch(\Exception $e){
            return response()->json(['error' => 'Error en la consulta: ' . $e->getMessage()], 500);
        }

    }

    public function crearVenta(Request $request){

      try{

        // DB::beginTransaction();

        // Validar los datos de la solicitud
            $data = $request->validate([
               'factura' => 'required|string|max:20|unique:venta,factura',
                'id_cliente' => 'required|integer',
            ]);

            $venta = ventaModel::create([
                'factura' => $data["factura"],
                'fecha' => now(),
                'id_cliente' => $data['id_cliente'],
                'total' => 0,
                'estado' => "en_proceso",
            ]);

            $total = 0;

            foreach ($request->productos as $producto) {

                $stock = inventarioModel::where("id_producto", $producto["id_producto"])->first();
                if($producto["cantidad"] > $stock->cantidad_disponible){
                    // DB::rollBack();
                    return response()->json(["message" => "La cantidad del producto ID:".$producto["id_producto"]." supera a la cantidad disponible"], 400);
                }

                $venta->producto()->attach($producto['id_producto'], [
                    'cantidad' => $producto['cantidad'],
                    'precio_venta' => $producto['precio_venta'],
                ]);

                $stock->cantidad_disponible -= $producto["cantidad"];
                $stock->save();
                $total += $producto["precio_venta"];
            
            }

            $venta->update(["total" => $total]);

            return response()->json(['message' => 'Venta creada exitosamente'], 201);
            // DB::commit();

        }catch(\Exception $e){
            // DB::rollBack();
            return response()->json(['message' => 'Error al crear la venta: ' . $e->getMessage()], 500);
        }

    }

    public function completarVenta(Request $request, $id){

        try{
            
            $venta = ventaModel::findOrFail($id);
            $venta->estado = "completada";
            $venta->save();

            return response()->json(['message' => 'Venta completada exitosamente'], 200);
        }catch(\Exception $e){
            return response()->json(['message' => 'Error al completar venta: ' . $e->getMessage()], 500);
        }

    }

    public function cancelarVenta(Request $request, $id)
    {
        try {
            if(!$id){
                return response()->json(['message' => 'ID de venta no proporcionado'], 400);
            }

            $venta = ventaModel::find($id);
            if (!$venta) { 
                return response()->json(['message' => 'Venta no encontrada'], 404);
            }

            $productos = $venta->producto->toArray();

            foreach ($productos as $producto) {

                $stock = inventarioModel::where("id_producto", $producto["id_producto"])->first();
                $stock->cantidad_disponible += $producto["pivot"]["cantidad"];
                $stock->save();

            }

            $venta->estado = 'cancelada';
            $venta->save();
           
            return response()->json(['message' => 'Venta cancelada exitosamente, existencias actualizadas'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al cancelar la venta: ' . $e->getMessage()], 500);
        }
    }

public function buscarPorFactura($factura)
{
    try {
        $venta = ventaModel::with(['cliente', 'detalles.producto.talla'])
            ->where('factura', $factura)
            ->first();

        if (!$venta) {
            return response()->json(['message' => 'Venta no encontrada.'], 404);
        }

        $response = [
            'id_venta' => $venta->id_venta,
            'factura' => $venta->factura,
            'cliente' => $venta->cliente->nombre,
            'detalles' => $venta->detalles->map(function ($detalle) {
                return [
                    'id_detalle_venta' => $detalle->id_detalle_venta,
                    'id_producto' => $detalle->producto->id_producto,
                    'nombre' => $detalle->producto->nombre,
                    'talla' => $detalle->producto->talla->descripcion,
                    'precio' => $detalle->precio,
                    'cantidad' => $detalle->cantidad
                ];
            })
        ];

        return response()->json($response);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al buscar factura: ' . $e->getMessage()], 500);
    }
}



    public function productosMasVendidos(){

        try{

            $productos = productoModel::with("talla")->get();
            $nombreProductos = [];

            foreach($productos as $producto){
         
                array_push($nombreProductos, [
                    "nombre" => $producto->nombre, 
                    "talla" => $producto->talla->descripcion,
                    "cantidad" => 0
                ]);
            }

            $ventas = ventaModel::with("producto")->get();

            foreach($ventas as $indice => $valor){

                if($valor->estado != "completada"){
                    continue;
                }

                foreach($valor->producto as $producto){

                    for ($i=0; $i < count($nombreProductos); $i++) { 
                
                        $nombre = $producto->nombre." ".$producto->talla->descripcion;
                        if($nombre == $nombreProductos[$i]["nombre"]." ".$nombreProductos[$i]["talla"]){
                            $nombreProductos[$i]["cantidad"] += $producto->pivot->cantidad;
                        }
                    }

                }

            }

            return response()->json($nombreProductos, 200);

        }catch(\Exception $e){
            return response()->json(['message' => 'Error en la consulta: ' . $e->getMessage()], 500);
        }

    }

    public function productosMayorGanancias(){

        try{
            
            $productos = productoModel::with("talla")->get();
            $nombreProductos = [];

            foreach($productos as $producto){
         
                array_push($nombreProductos, [
                    "nombre" => $producto->nombre, 
                    "talla" => $producto->talla->descripcion,
                    "ganancias" => 0
                ]);
            }

            $ventas = ventaModel::with("producto")->get();

            foreach($ventas as $indice => $valor){

                if($valor->estado != "completada"){
                    continue;
                }

                foreach($valor->producto as $producto){

                    for ($i=0; $i < count($nombreProductos); $i++) { 
                
                        $nombre = $producto->nombre." ".$producto->talla->descripcion;
                        if($nombre == $nombreProductos[$i]["nombre"]." ".$nombreProductos[$i]["talla"]){
                            $nombreProductos[$i]["ganancias"] += $producto->pivot->precio_venta;
                        }
                    }

                }

            }

            return response()->json($nombreProductos, 200);

        }catch(\Exception $e){
            return response()->json(['message' => 'Error en la consulta: ' . $e->getMessage()], 500);
        }

    }

    public function generarPDF($id){
        $venta = ventaModel::with(['cliente', 'producto'])->findOrFail($id);

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

        $pdf->Cell(0, 18, 'Detalle de Venta #' . $venta->id_venta, 0, 1, 'C');
        $pdf->Ln(20);

        // Datos generales
        $pdf->SetFont('Arial', '', 14);
        $pdf->SetTextColor(0);

        $pdf->Cell(0, 8, 'Factura de venta: ' . $venta->factura, 0, 1);
        $pdf->Cell(0, 8, utf8_decode('Cliente: ' . $venta->cliente->nombre), 0, 1);
        $pdf->Cell(0, 8, utf8_decode('Cédula: ' . $venta->cliente->cedula), 0, 1);
        $pdf->Cell(0, 8, 'Fecha de venta: ' . $venta->fecha, 0, 1);
        $pdf->Cell(0, 8, utf8_decode('Estado: ' . ucfirst($venta->estado)), 0, 1);
        $pdf->Ln(8);

        // Tabla productos
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetFillColor(75, 46, 131); // Morado
        $pdf->SetTextColor(255);

        $pdf->Cell(70, 8, 'Producto', 1, 0, 'C', true);
        $pdf->Cell(20, 8, 'Talla', 1, 0, 'C', true);
        $pdf->Cell(30, 8, 'Cantidad', 1, 0, 'C', true);
        $pdf->Cell(40, 8, 'Precio Unitario', 1, 0, 'C', true);
        $pdf->Cell(30, 8, 'Subtotal', 1, 1, 'C', true);

        $pdf->SetFont('Arial', '', 11);
        $pdf->SetTextColor(0);

        foreach ($venta->producto as $producto) {

            $talla = tallaModel::find($producto->id_talla);
            $total = $producto->precio_unitario * $producto->porcentaje_ganancia / 100;
            $total += $producto->precio_unitario;

            $pdf->Cell(70, 8, utf8_decode($producto->nombre), 1);
            $pdf->Cell(20, 8, utf8_decode($talla->descripcion), 1, 0, "C");
            $pdf->Cell(30, 8, $producto->pivot->cantidad, 1, 0, 'C');
            $pdf->Cell(40, 8, number_format($total, 2), 1, 0, 'R');
            $pdf->Cell(30, 8, number_format($producto->pivot->precio_venta, 2), 1, 1, 'R');
        }

        // Total
        $pdf->Ln(3);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, 'Total General: Bs ' . number_format($venta->total, 2), 0, 1, 'R');

        // Firma
        // $pdf->Ln(20);
        // $pdf->SetFont('Arial', '', 11);
        // $pdf->Cell(60, 8, '__________________________', 0, 0, 'C');
        // $pdf->Cell(60, 8, '__________________________', 0, 0, 'C');
        // $pdf->Cell(60, 8, '__________________________', 0, 1, 'C');

        // $pdf->Cell(60, 6, 'Receptor', 0, 0, 'C');
        // $pdf->Cell(60, 6, 'Almacenista', 0, 0, 'C');
        // $pdf->Cell(60, 6, 'Supervisor', 0, 1, 'C');

        $pdf->Output();
        exit;
    }

}
