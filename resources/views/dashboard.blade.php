<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ModaSoft - Dashboard</title>
  <link rel="stylesheet" href="../css/dashboard.css">
  <script src="../js/sesiones.js"></script>
  <script src="../js/dashboard.js" defer></script>
</head>
<body>
  <div class="container">
    
    <aside class="sidebar">
    <img src="{{ asset('img/logo_modasoft.png') }}" alt="Logo de ModaSoft" />
    <ul>
        <li><span>🛍️</span> Productos y Tallas</li>
        <li><span>📦</span> Inventario y Compras</li>
        <li><span>💲</span> Cuentas por Pagar/ Cobrar</li>
        <li><span>🧾</span> Ventas y Devoluciones</li>
        <li><span>📚</span> Libro Diario/Mayor</li>
        <li><span>📄</span> Registro Contable</li>
        <li><span>📊</span> Reportes</li>
    </ul>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <span class="user">Usuario: <strong id="user"></strong> -> <strong id="role"></strong></span>
        <button id="logout" title="Cerrar sesión"><span>🚪</span></button>
      </header>

      <section class="welcome">
        <h1>Bienvenido al sistema <br> <strong>ModaSoft</strong></h1>
        <div class="actions">
          <a href="{{ route('view.inventario') }}"><button class="btn blue">📦 Ir a Inventario</button></a>
          <button class="btn blue">📊 Ver Reportes</button>
          <button class="btn blue">💰 Registrar venta</button>
        </div>
      </section>
    </main>
  </div>
</body>
</html>

