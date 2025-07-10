<?php
namespace App\Http\Controllers;

use App\Models\transaccionModel as Transaccion;
use App\Models\cuentaContableModel as CuentaContable;
use Illuminate\Http\Request;

class ContabilidadController extends Controller
{
    // Registrar transacciones
    public function registrarTransaccion(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'id_cuenta' => 'required|exists:cuentas_contables,id_cuenta',
            'monto' => 'required|numeric',
            'tipo' => 'required|in:DEBITO,CREDITO',
        ]);

        $transaccion = new Transaccion();
        $transaccion->fecha = $request->fecha;
        $transaccion->id_cuenta = $request->id_cuenta;
        $transaccion->monto = $request->monto;
        $transaccion->tipo = $request->tipo;
        $transaccion->save();

        return response()->json(['message' => 'Transacción registrada con éxito'], 201);
    }

    // Obtener el libro diario
    public function obtenerLibroDiario()
    {
        $transacciones = Transaccion::with('cuentaContable')->get();
        return response()->json($transacciones);
    }

    // Obtener el libro mayor
    public function obtenerLibroMayor()
    {
        $cuentas = CuentaContable::withSum('transacciones as saldo', 'monto')->with("transacciones")->get();
        return response()->json($cuentas);
    }

    // Obtener las cuentas contables
    public function obtenerCuentasContables()
    {
        $cuentas = CuentaContable::all();
        return response()->json($cuentas);
    }
}
