

<?php $__env->startSection('title', 'Dashboard - ModaSoft'); ?>
<?php $__env->startSection("content"); ?>

      <section class="welcome">
        <h1>Bienvenido al sistema <br> <strong>ModaSoft</strong></h1>
        <div class="actions">
          <a href="<?php echo e(route('view.inventario')); ?>"><button class="btn blue">📦 Ir a Inventario</button></a>
          <button class="btn blue">📊 Ver Reportes</button>
          <button class="btn blue">💰 Registrar venta</button>
        </div>
      </section>

<?php $__env->stopSection(); ?>

<?php $__env->startPush('styles'); ?>

  <link rel="stylesheet" href="<?php echo e(asset('css/dashboard.css')); ?>">

<?php $__env->stopPush(); ?>

<?php echo $__env->make('components.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\laragon\www\Proyecto_ModaSoft\resources\views/dashboard.blade.php ENDPATH**/ ?>