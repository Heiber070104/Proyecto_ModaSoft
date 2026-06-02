<script>
    import { setSession } from '$lib/stores/session.js';
    import { authApi } from '$lib/api/auth.js';
    import { goto } from '$app/navigation';
    import logoModaSoft from '$lib/assets/logo_modasoft_N.png'; // Nos traemos el logo

    // ... nuestra lógica de Svelte 5 al día
    let email = $state(''); // 'Usuario' en la interfaz
    let password = $state('');
    let errorMessage = $state('');
    let isLoading = $state(false);

    async function handleLogin(event) {
        isLoading = true;
        errorMessage = '';

        try {
            const data = await authApi.login(email, password);

            if (data.user && data.token) {
                setSession(data.user, data.token);
                goto('/dashboard');
            } else {
                errorMessage = data.message || 'Credenciales inválidas';
            }
        } catch (error) {
            if(error.status === 422) {
                errorMessage = 'Credenciales inválidas';
            } else {
                errorMessage = 'Error de conexión con el servidor';
            }
        } finally {
            isLoading = false;
        }
    }
</script>

<!-- 
   Aquí está la estructura para el diseño:
   1. Un wrapper principal con la imagen de fondo.
   2. El contenedor central para el logo y el card.
-->
<div class="login-wrapper">
    <div class="blurred-background"></div>

    <div class="container d-flex justify-content-center align-items-center" style="min-height:100vh;">
        <div class="w-100" style="max-width:420px;">
            <div class="text-center mb-4">
                <img src={logoModaSoft} alt="ModaSoft Logo" class="img-fluid" style="max-width:180px;" />
            </div>

            <div class="card login-card shadow-sm">
                <div class="card-body">
                    <form on:submit|preventDefault={handleLogin}>
                        <div class="mb-3">
                            <label for="email" class="form-label">Correo Electrónico</label>
                            <div class="input-group">
                                <span class="input-group-text">&#128100;</span>
                                <input
                                    type="text"
                                    id="email"
                                    class="form-control"
                                    bind:value={email}
                                    placeholder="Correo Electrónico"
                                    required
                                />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <div class="input-group">
                                <span class="input-group-text">&#128274;</span>
                                <input
                                    type="password"
                                    id="password"
                                    class="form-control"
                                    bind:value={password}
                                    placeholder="Contraseña"
                                    required
                                />
                            </div>
                        </div>

                        {#if errorMessage}
                            <div class="alert alert-danger py-2" role="alert">{errorMessage}</div>
                        {/if}

                        <button type="submit" class="btn btn-primary w-100" disabled={isLoading}>
                            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Estilos globales y reseteos para este componente */
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
    }

    /* 1. Wrapper principal: pantalla completa, centrado y con el fondo */
    .login-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
    }

    /* Fondo de la tienda, con el efecto de desenfoque aplicado */
    .blurred-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* Asegúrate de ajustar la ruta de tu imagen de fondo */
        background-image: url('$lib/assets/background_login.jpg');
        background-size: cover;
        background-position: center;
        filter: blur(8px); /* ¡Aquí está la magia del desenfoque! */
        z-index: -1; /* Pa' que quede atrás */
        transform: scale(1.1); /* Evitamos bordes blancos al desenfocar */
    }

    /* Contenedor central: logo + card */
    .container { z-index:1; }
    .login-card {
        background-color: rgba(var(--bs-body-bg-rgb), 0.78);
        color: var(--bs-body-color);
        backdrop-filter: blur(6px);
        border-color: var(--bs-border-color-translucent);
        border-radius: 12px;
    }

    /* Estilos de los grupos de formularios */
    .mb-3 { margin-bottom: 1rem; }
    .alert { margin-bottom: 1rem; }
</style>
