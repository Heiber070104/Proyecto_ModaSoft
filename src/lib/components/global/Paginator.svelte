<script>

    let {
        total = 0,
	    from = 0,
	    to = 0,
	    currentPage = 1,
	    lastPage = 1,
	    loading = false,
	    entityLabel = "entradas",
		onPageChange = () => {}
    } = $props();

	function goTo(page) {
		onPageChange?.(page)
	}
</script>

<div class="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
	<div class="text-muted large">
		{#if total > 0}
			Mostrando <strong>{from}</strong> a <strong>{to}</strong> de <strong>{total}</strong> {entityLabel}
		{:else}
			Sin registros
		{/if}
	</div>
	<div class="btn-group btn-group-sm">
		<button
			type="button"
			class="btn btn-outline-secondary"
			disabled={currentPage <= 1 || loading}
			onclick={() => goTo(currentPage - 1)}
		>
			Anterior
		</button>
		<button type="button" class="btn btn-outline-secondary" disabled>
			Pagina {currentPage} de {lastPage}
		</button>
		<button
			type="button"
			class="btn btn-outline-secondary"
			disabled={currentPage >= lastPage || loading}
			onclick={() => goTo(currentPage + 1)}
		>
			Siguiente
		</button>
	</div>
</div>