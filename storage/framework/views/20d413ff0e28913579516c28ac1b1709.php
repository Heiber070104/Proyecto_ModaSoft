

<?php $__env->startSection("title", "Tallas - ModaSoft"); ?>
<?php $__env->startSection("content"); ?> 

    <h1 class="welcome">Tallas</h1>

    

    <table id="tabla" class="tabla-elegante">

        <thead>
            <th>Descripción</th>
            <th>Opciones</th>
        </thead>

        <tbody id="datos">

        </tbody>

    </table>

<?php $__env->stopSection(); ?>

<?php $__env->startPush("scripts"); ?>

    <script src="<?php echo e(asset('js/sesiones.js')); ?>"></script>
    <script src="<?php echo e(asset('js/tallas.js')); ?>" defer></script>   

<?php $__env->stopPush(); ?>

<?php $__env->startPush("styles"); ?>

    <link rel="stylesheet" href="<?php echo e(asset('css/tablas.css')); ?>">

<?php $__env->stopPush(); ?>
<?php echo $__env->make("components.app", \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\laragon\www\Proyecto_ModaSoft\resources\views/tallas.blade.php ENDPATH**/ ?>