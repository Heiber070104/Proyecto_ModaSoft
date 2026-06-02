<script>
    import { fly } from 'svelte/transition';
    import { user, destroySession, isAuthenticated } from '$lib/stores/session.js';
    import { onMount } from 'svelte';
    import { authApi } from '$lib/api/auth.js';
    import { goto } from '$app/navigation';
    
    let { isOpen } = $props();

    async function handleLogout() {
        try {   
            await authApi.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }finally {
            destroySession();
            goto('/auth/login');
        }   
    }
</script>

{#if isOpen}
    <div class="position-absolute" style="top:20px; right:20px; z-index:100;" transition:fly={{ y: -200 }} >
        <div class="card" style="width:260px;">
            <div class="card-body text-center">
                <div class="mb-2">
                    <i class="bi bi-person-bounding-box" style="font-size: 4rem;"></i>
                </div>
                <h6 class="card-title">{$user?.username || 'N/A'}</h6>
                <p class="card-text mb-1"><small class="text-muted">{$user?.personal_name || 'N/A'}</small></p>
                <p class="card-text"><small class="text-muted">{$user?.email || 'N/A'}</small></p>
                <button class="btn btn-danger w-100 mt-2" onclick={handleLogout}>
                    <i class="bi bi-box-arrow-left"></i>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    </div>
{/if}