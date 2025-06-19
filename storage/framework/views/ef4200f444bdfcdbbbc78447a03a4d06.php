<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?php echo e(asset('css/app.css')); ?>">
    <title><?php echo $__env->yieldContent("title", "ModaSoft"); ?></title>

</head>
<body>

    <div class="container">

    <aside class="sidebar">
        <img src="<?php echo e(asset('img/logo_modasoft.png')); ?>" alt="Logo de ModaSoft" />
        <ul>
            <li><span>📺</span> <a href="<?php echo e(route('view.dashboard')); ?>">Panel principal</a></li>
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

        <header>
        
            <main class="main-content">
                <header class="topbar">
                    <span class="user">Usuario: <strong id="user"></strong> -> <strong id="role"></strong></span>
                    <button id="logout" title="Cerrar sesión"><span>🚪</span></button>
                </header>
            </main>

        </header>

        <?php echo $__env->yieldContent("content"); ?>

    </main>

    </div>
    
</body>
</html>

<script src="<?php echo e(asset('js/sesiones.js')); ?>"></script>
<script src="<?php echo e(asset('js/app.js')); ?>" defer></script>

<?php echo $__env->yieldPushContent("scripts"); ?>
<?php echo $__env->yieldPushContent("styles"); ?>
<?php /**PATH C:\laragon\www\Proyecto_ModaSoft\resources\views/components/app.blade.php ENDPATH**/ ?>