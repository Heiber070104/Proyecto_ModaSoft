

<?php $__env->startSection('title', 'Inventario - ModaSoft'); ?>
<?php $__env->startSection("content"); ?>

    <h1 class="welcome">Inventario</h1>

    <a href="<?php echo e(route('view.nuevoProducto')); ?>"><button class="btn blue">Nuevo producto</button></a>

    <a href="<?php echo e(route('view.tallas')); ?>"><button class="btn blue">Tallas</button></a>

    <table id="tabla" class="tabla-elegante">

        <thead>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio C/U</th>
            <th>Categoria</th>
            <th>Talla</th>
            <th>Disponibles</th>
            <th>Opciones</th>
        </thead>

        <tbody id="datos">

        </tbody>

    </table>

<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>

    <script src="<?php echo e(asset('js/sesiones.js')); ?>"></script>
    <script src="<?php echo e(asset('js/inventario.js')); ?>" defer></script>

<?php $__env->stopPush(); ?>

<?php $__env->startPush('styles'); ?>

    <link rel="stylesheet" href="<?php echo e(asset('css/tablas.css')); ?>">

<?php $__env->stopPush(); ?>

<?php echo $__env->make('components.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\laragon\www\Proyecto_ModaSoft\resources\views/inventario.blade.php ENDPATH**/ ?>