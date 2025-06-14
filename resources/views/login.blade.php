<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Login - ModaSoft</title>
  <link rel="stylesheet" href="{{ asset('css/login.css')}}" />
  <script src="{{ asset('js/sesiones.js')}}"></script>
  <script src="{{ asset('js/login.js')}}" defer></script>
</head>
<body>
  <div class="logo-header">
    <img src="{{ asset('img/logo_modasoft.png') }}" alt="Logo de ModaSoft" />
  </div>

  <div class="login-container">
    <form id="loginForm">
      <label for="usuario">Usuario</label>
      <div class="input-icon">
        <span class="icon">👤</span>
        <input type="text" id="usuario" name="usuario" placeholder="Usuario" required />
      </div>

      <label for="contraseña">Contraseña</label>
      <div class="input-icon">
        <span class="icon">🔒</span>
        <input type="password" id="contraseña" name="contraseña" placeholder="Contraseña" required />
      </div>

      <button type="submit">Iniciar Sesión</button>
      <p><a href="{{ route('view.register')}}">¿Olvidó su contraseña?</a></p>
    </form>
  </div>
</body>
</html>
