<script>
    // Recibimos las funciones para cambiar los estados allá arriba en el Layout
    let { toggleSidebar, toggleDarkMode, toggleUserInfo, isDarkMode, isSidebarOpen } = $props();
</script>

<nav class="navbar bg-body border-bottom px-3 app-header {isSidebarOpen ? '' : 'collapsed'}">
    <div class="d-flex align-items-center">
        <button class="btn btn-outline-secondary me-2" style="border: none;" onclick={toggleSidebar} aria-label="Toggle sidebar">
            <i class="bi bi-list"></i>
        </button>
        <span class="navbar-brand mb-0 h3 text-muted">ModaSoft</span>
    </div>

    <div class="d-flex align-items-center">
        <button class="btn btn-outline-secondary me-2" style="border: none;" onclick={toggleDarkMode} aria-label="Toggle dark mode">
            <i class={isDarkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'}></i>
        </button>
        <button class="btn btn-outline-secondary" style="border: none;" onclick={toggleUserInfo} aria-label="User info">
            <i class="bi bi-person-circle"></i>
        </button>
    </div>
</nav>

<style>
    .app-header {
        position: fixed;
        top: 0;
        right: 0;
        left: 250px;
        z-index: 1030;
        min-height: 57px;
        transition: left 0.25s ease;
    }

    .app-header.collapsed {
        left: 64px;
    }
</style>
