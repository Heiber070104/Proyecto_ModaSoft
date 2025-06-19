<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Registro - ModaSoft</title>
  <link rel="stylesheet" href="../css/login.css" />
  <script src="../js/register.js" type="module" defer></script>
</head>
<body>
  <div class="login-container">
    <h1>Registro en ModaSoft</h1>
    <form id="registerForm">
      <label for="nombre">Nombre Personal</label>
      <input type="text" id="nombre_personal" name="nombre_personal" required />

      <label for="correo">Correo</label>
      <input type="email" id="correo" name="correo" required />

      <label for="rol">Rol</label>
      <select id="rol" name="rol" required>
        <option value="Administrador">Administrador</option>
        <option value="Vendedor">Vendedor</option>
        <option value="Contador">Contador</option>
      </select>

      <label for="usuario">Nombre de usuario</label>
      <input type="text" id="nombre_usuario" name="nombre_usuario" required />

      <label for="contraseña">Contraseña</label>
      <input type="password" id="contraseña" name="contraseña" required />

      <button type="submit">Registrar</button>
    </form>
    <p>¿Ya tienes cuenta? <a href="<?php echo e(route('view.login')); ?>">Inicia sesión</a></p>
  </div>
</body>
</html>

<?php /**PATH C:\laragon\www\Proyecto_ModaSoft\resources\views/register.blade.php ENDPATH**/ ?>