<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
    import Sidebar from '$lib/components/layout/Sidebar.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import PersonalInformation from '$lib/components/layout/PersonalInformation.svelte';
	import { onMount } from 'svelte';
	import { isAuthenticated, refreshSession, destroySession } from '$lib/stores/session.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authApi } from '$lib/api/auth.js';
	import { browser } from '$app/environment';

    // Propiedad por defecto de Svelte 5 para renderizar el contenido de las páginas
    let { children } = $props();

	const publicRoutes = [
		'/auth/login'
	];

	const getInitialTheme = () => {
		if (browser){
			return localStorage.getItem('theme') === 'dark'
		}
		return false;
	}

	let isPublic = $derived(publicRoutes.includes($page.url.pathname));

    // Estados reactivos pa' controlar los paneles y el tema
    let isSidebarOpen = $state(true);
    let isDarkMode = $state(getInitialTheme());
    let isUserInfoOpen = $state(false);

	$effect(() => {
		if(browser){
			document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
			localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
		}
	})
	
    // Funciones toggle para cambiar los estados
    function toggleSidebar() { isSidebarOpen = !isSidebarOpen; }
    function toggleDarkMode() { isDarkMode = !isDarkMode; }
    function toggleUserInfo() { isUserInfoOpen = !isUserInfoOpen; }

	onMount(async () => {
		if(isPublic) return; 
		if(!$isAuthenticated) {
			goto('/auth/login');
		}else{
			try {
				const response = await authApi.me();
				if(response && response.user) {
					refreshSession(response.user);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
				destroySession();
				goto('/auth/login');
			}
		}
	});
</script>

{#if isPublic }
	{@render children()}
{:else}
	<div class="layout-wrapper bg-body text-body">
		<div class="container-fluid p-0">
			<div class="row g-0">
				<div class="col-auto">
					<Sidebar isOpen={isSidebarOpen} />
				</div>

				<div class="col main-column pb-0">
					<Header 
						toggleSidebar={toggleSidebar} 
						toggleDarkMode={toggleDarkMode} 
						toggleUserInfo={toggleUserInfo} 
						{isDarkMode}
					/>

					<div class="position-relative">
						<PersonalInformation isOpen={isUserInfoOpen} />
					</div>

					<main class="page-content container-fluid py-4 bg-body-tertiary">
						{@render children()}
					</main>

					<Footer />
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
    /* Estructura general de flexbox pa' poner el sidebar al lado del contenido */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		background-color: var(--bs-body-bg);
		color: var(--bs-body-color);
	}

	:global(html[data-bs-theme='dark']) {
		color-scheme: dark;
	}

	.layout-wrapper { min-height: 100vh; }
	.main-column { display: flex; flex-direction: column; min-height: 100vh; }
	.page-content { flex: 1; overflow-y: auto; }
	
</style>
