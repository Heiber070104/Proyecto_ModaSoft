<script>
    import { navigationModules } from '$lib/data/navigation.js';
    import { user } from '$lib/stores/session.js'
    import can from '$lib/services/guard.js'
    import logoModaSoft from '$lib/assets/logo_modasoft.png'; // Asegúrate de tener esta ruta

    const CURRENT_PERMISSIONS = $derived($user?.permissions ?? []);

    // Recibimos si el menú está abierto o cerrado desde el Layout principal
    let { isOpen } = $props();
</script>

<aside class="sidebar d-flex flex-column bg-dark {isOpen ? 'open' : 'collapsed'}">
    <div class="sidebar-logo text-center">
        <img src={logoModaSoft} alt="ModaSoft Logo" class="img-fluid logo-image" />
    </div>

    <nav class="nav nav-pills flex-column sidebar-nav">
        {#each navigationModules as navItem}
            {#if can(CURRENT_PERMISSIONS, navItem.permission)}
                <a
                    href={navItem.ref}
                    class="nav-link sidebar-link text-white rounded"
                    title={isOpen ? undefined : navItem.name}
                    aria-label={navItem.name}
                >
                    <i class="bi {navItem.icon} sidebar-icon" aria-hidden="true"></i>
                    {#if isOpen}
                        <span class="sidebar-label">{navItem.name}</span>
                    {/if}
                </a>
            {/if}
        {/each}
    </nav>
</aside>

<style>

    .sidebar {
        width: 250px;
        height: 100vh;
        overflow: hidden;
        position: fixed;
        transition: width 0.25s ease;
    }

    .collapsed {
        width: 64px;
    }

    .sidebar-logo {
        padding: 1.25rem 1rem;
    }

    .logo-image {
        max-height: 92px;
        transition: max-height 0.25s ease;
        color: #333;
    }

    .collapsed .sidebar-logo {
        padding: 1rem 0.75rem;
    }

    .collapsed .logo-image {
        max-height: 36px;
    }

    .sidebar-nav {
        gap: 0.25rem;
        padding: 0.5rem;
    }

    .sidebar-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-height: 44px;
        padding: 0.625rem 0.75rem;
        white-space: nowrap;
    }

    .sidebar-link:hover,
    .sidebar-link:focus {
        background-color: rgba(255, 255, 255, 0.12);
    }

    .sidebar-icon {
        width: 1.25rem;
        min-width: 1.25rem;
        text-align: center;
        font-size: 1.15rem;
        line-height: 1;
    }

    .collapsed .sidebar-link {
        justify-content: center;
        gap: 0;
        padding: 0.625rem;
    }
</style>
