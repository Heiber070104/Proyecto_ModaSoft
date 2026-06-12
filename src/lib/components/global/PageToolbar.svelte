<script>

    let {
        total = 0,
        entityLabel = 'registros',
        perPage = 50,
        perPageOptions = [10, 25, 50, 100],
        perPageId = 'crud-per-page',
        newButtonText = 'Nuevo',
        newButtonIcon = 'bi bi-plus',
        totalLabel = 'Tabla',
        showPerPage = true,
        showCreateButton = true,
        showTotal = true,
        onPerPageChange = () => {},
        onCreate = () => {},
    } = $props();

	function handlePerPageChange(event) {
        onPerPageChange?.({ value: Number(event.currentTarget.value) })
	}

	function handleCreate() {
        onCreate();
	}
</script>

<div class="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
	{#if showTotal}
		<div class="text-muted small">
			Total: <strong>{total}</strong>
			{entityLabel}
		</div>
	{:else}
		<div class="text-muted large">
			<strong>{totalLabel}</strong>
		</div>
	{/if}
	<div class="d-flex align-items-center gap-2">
		{#if showPerPage}
			<label class="mb-0 large text-muted" for={perPageId}>Mostrar</label>
			<select
				id={perPageId}
				class="form-select form-select-sm w-auto"
				value={perPage}
				onchange={handlePerPageChange}
			>
				{#each perPageOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		{/if}
		{#if showCreateButton}
			<button class='btn btn-primary' onclick={handleCreate}>
				<span class="d-inline-flex align-items-center gap-1">
					<i class={newButtonIcon}></i>
					<span>{newButtonText}</span>
				</span>
			</button>
		{/if}
	</div>
</div>