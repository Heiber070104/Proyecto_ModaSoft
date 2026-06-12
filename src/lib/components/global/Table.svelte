<script>
	let {
		columns = [],
		rows = [],
		rowKey = 'id',
		rowsPerPage = 10,
		rowsPerPageOptions = [10, 25, 50, 100],
		searchable = true,
		searchPlaceholder = 'Buscar...',
		searchKeys = null,
		emptyMessage = 'Sin resultados',
		loading = false,
		showRowsPerPage = true,
		showRowCount = true,
		showPagination = true,
		tableClass = 'table align-middle table-nowrap mb-0',
		striped = true,
		stripedInverted = false,
		serverSide = false,
		serverSort = { identifier: null, direction: null },
		onSortChange = () => {},
		onSearchInput = () => {},
		cell
	} = $props();

	let searchTerm = $state('');
	let currentRowsPerPage = $state(10);
	let pageNumber = $state(1);
	let localSort = $state({ identifier: null, direction: null, sortBy: null });

	let activeSort = $derived(serverSide ? serverSort ?? { identifier: null, direction: null } : localSort);
	let searchableColumns = $derived(
		searchKeys ??
			columns
				.filter((column) => column.searchable !== false)
				.map((column) => column.searchBy ?? column.key)
				.filter(Boolean)
	);

	let filteredRows = $derived.by(() => {
		const sourceRows = rows ?? [];

		if (serverSide || !searchable || !searchTerm) {
			return sourceRows;
		}

		const normalizedSearch = String(searchTerm).toLowerCase();
		const scope = searchableColumns.length ? searchableColumns : columns.map((column) => column.key);

		return sourceRows.filter((row) =>
			scope.some((key) => String(getValueByKey(key, row) ?? '').toLowerCase().includes(normalizedSearch))
		);
	});

	let sortedRows = $derived.by(() => {
		if (serverSide || !localSort.identifier || !localSort.direction) {
			return filteredRows;
		}

		return [...filteredRows].sort((firstRow, secondRow) => {
			const firstValue = getValueByKey(localSort.sortBy, firstRow);
			const secondValue = getValueByKey(localSort.sortBy, secondRow);
			const comparison = compareValues(firstValue, secondValue);

			return localSort.direction === 'asc' ? comparison : -comparison;
		});
	});

	let pageCount = $derived(Math.ceil(sortedRows.length / currentRowsPerPage));

	let displayRows = $derived(
		serverSide
			? rows ?? []
			: sortedRows.slice((pageNumber - 1) * currentRowsPerPage, pageNumber * currentRowsPerPage)
	);

	let rowCount = $derived.by(() => {
		const total = serverSide ? (rows ?? []).length : sortedRows.length;

		if (total === 0) {
			return { start: 0, end: 0, total };
		}

		const start = serverSide ? 1 : (pageNumber - 1) * currentRowsPerPage + 1;
		const end = serverSide ? total : Math.min(pageNumber * currentRowsPerPage, total);

		return { start, end, total };
	});

	let pages = $derived(getPaginationPages(pageNumber, pageCount));

	$effect(() => {
		currentRowsPerPage = rowsPerPage;
		pageNumber = 1;
	});

	$effect(() => {
		if (pageCount > 0 && pageNumber > pageCount) {
			pageNumber = pageCount;
		}
	});

	function getColumnId(column) {
		if (column.id) {
			return column.id;
		}
		if (typeof column.key === 'string') {
			return column.key;
		}
		return column.label ?? 'column';
	}

	function getCellValue(column, row) {
		if (typeof column.value === 'function') {
			return column.value(row);
		}
		if (typeof column.key === 'function') {
			return column.key(row);
		}
		if (column.key) {
			return row[column.key];
		}
		return '';
	}

	function getValueByKey(key, row) {
		if (typeof key === 'function') {
			return key(row);
		}
		if (key) {
			return row[key];
		}
		return '';
	}

	function compareValues(firstValue, secondValue) {
		if (firstValue === secondValue) {
			return 0;
		}
		if (firstValue === null || firstValue === undefined) {
			return 1;
		}
		if (secondValue === null || secondValue === undefined) {
			return -1;
		}
		if (typeof firstValue === 'number' && typeof secondValue === 'number') {
			return firstValue - secondValue;
		}
		return String(firstValue).localeCompare(String(secondValue), undefined, {
			numeric: true,
			sensitivity: 'base'
		});
	}

	function handleSort(column) {
		if (!column.sortable) {
			return;
		}

		const orderBy = column.sortBy ?? column.key;
		const identifier = column.sortId ?? getColumnId(column);

		if (serverSide) {
			let direction = 'asc';
			if (activeSort.identifier === identifier) {
				direction = activeSort.direction === 'asc' ? 'desc' : 'asc';
			}
			onSortChange?.({ identifier, direction, sortBy: orderBy, column });
			return;
		}

		localSort = {
			identifier,
			direction: localSort.identifier === identifier && localSort.direction === 'asc' ? 'desc' : 'asc',
			sortBy: orderBy
		};
		pageNumber = 1;
	}

	function getAlignClass(column) {
		if (column.align === 'right' || column.align === 'end') {
			return 'text-end';
		}
		if (column.align === 'center') {
			return 'text-center';
		}
		return '';
	}

	function handleSearchInput() {
		pageNumber = 1;
		if (!serverSide) {
			return;
		}
		onSearchInput?.({ value: searchTerm });
	}

	function setPage(page) {
		if (page === 'previous') {
			pageNumber = Math.max(1, pageNumber - 1);
			return;
		}
		if (page === 'next') {
			pageNumber = Math.min(pageCount, pageNumber + 1);
			return;
		}
		pageNumber = page;
	}

	function handleRowsPerPageChange() {
		pageNumber = 1;
	}

	function getPaginationPages(currentPage, totalPages) {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, index) => index + 1);
		}

		const visiblePages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
		const validPages = [...visiblePages]
			.filter((page) => page >= 1 && page <= totalPages)
			.sort((firstPage, secondPage) => firstPage - secondPage);

		return validPages.reduce((result, page, index) => {
			if (index > 0 && page - validPages[index - 1] > 1) {
				result.push(null);
			}
			result.push(page);
			return result;
		}, []);
	}
</script>

<div class="dataTables_wrapper">
	<div class="row align-items-center mb-3">
		{#if searchable}
			<div class="col-sm-12 col-md-6">
				<div class="dataTables_filter">
					<label class="d-flex align-items-center gap-2 mb-0">
						<span class="text-muted">Buscar:</span>
						<input
							type="search"
							class="form-control form-control-sm"
							placeholder={searchPlaceholder}
							bind:value={searchTerm}
							oninput={handleSearchInput}
						/>
					</label>
				</div>
			</div>
		{/if}

		{#if showRowsPerPage}
			<div class="col-sm-12 col-md-6 text-md-end mt-2 mt-md-0">
				<div class="dataTables_length d-inline-flex align-items-center gap-2">
					<span class="text-muted">Mostrar</span>
					<select
						class="form-select form-select-sm w-auto"
						bind:value={currentRowsPerPage}
						onchange={handleRowsPerPageChange}
					>
						{#each rowsPerPageOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
					<span class="text-muted">entradas</span>
				</div>
			</div>
		{/if}
	</div>

	<div class="table-responsive datatable-container">
		<table
			class={`${tableClass} dataTable ${striped ? 'table-striped' : ''} ${
				striped && stripedInverted ? 'table-striped-inverted' : ''
			}`}
		>
			<thead>
				<tr>
					{#each columns as column}
						<th
							class={`${column.sortable ? 'sortable' : ''} ${getAlignClass(column)} ${column.headerClass ?? ''}`}
							style={column.width ? `width: ${column.width}` : ''}
							onclick={() => handleSort(column)}
						>
							<div class="d-inline-flex align-items-center gap-1">
								<span class="text-muted"><strong>{column.label}</strong></span>
								{#if column.sortable}
									<span
										class={`sort-indicator ${
											activeSort.identifier === (column.sortId ?? getColumnId(column))
												? activeSort.direction ?? ''
												: ''
										}`}
									></span>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#if loading}
					<tr>
						<td colspan={columns.length} class="text-center py-4 text-muted">
							Cargando...
						</td>
					</tr>
				{:else if displayRows.length === 0}
					<tr>
						<td colspan={columns.length} class="text-center py-4 text-muted">
							{emptyMessage}
						</td>
					</tr>
				{:else}
					{#each displayRows as row, index (row[rowKey] ?? index)}
						<tr>
							{#each columns as column}
								<td class={`${getAlignClass(column)} ${column.cellClass ?? ''}`}>
									{#if cell}
										{@render cell({ row, column, value: getCellValue(column, row) })}
									{:else}
										{getCellValue(column, row) ?? '-'}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<div class="row align-items-center mt-3">
		{#if showRowCount}
			<div class="col-sm-12 col-md-5 text-muted">
				{#if rowCount.total === 0}
					{emptyMessage}
				{:else}
					Mostrando {rowCount.start} a {rowCount.end} de {rowCount.total} entradas
				{/if}
			</div>
		{/if}

		{#if showPagination}
			<div class="col-sm-12 col-md-7">
				{#if pageCount > 1}
					<ul class="pagination justify-content-md-end mb-0">
						<li class={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
							<button class="page-link" type="button" onclick={() => setPage('previous')}>
								Anterior
							</button>
						</li>

						{#each pages as page}
							{#if page === null}
								<li class="page-item disabled">
									<span class="page-link">&hellip;</span>
								</li>
							{:else}
								<li class={`page-item ${page === pageNumber ? 'active' : ''}`}>
									<button class="page-link" type="button" onclick={() => setPage(page)}>
										{page}
									</button>
								</li>
							{/if}
						{/each}

						<li class={`page-item ${pageNumber === pageCount ? 'disabled' : ''}`}>
							<button class="page-link" type="button" onclick={() => setPage('next')}>
								Siguiente
							</button>
						</li>
					</ul>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.sortable {
		cursor: pointer;
		user-select: none;
	}

	.sort-indicator {
		display: inline-block;
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-top: 6px solid #c1c1c1;
	}

	.sort-indicator.asc {
		border-top-color: transparent;
		border-bottom: 6px solid #495057;
	}

	.sort-indicator.desc {
		border-top-color: #495057;
	}

	:global(.datatable-container) {
		border: 1px solid var(--bs-border-color);
		border-radius: 12px;
		overflow: auto;
	}

	:global(.datatable-container .dataTable) {
		margin-bottom: 0;
	}

	:global(.datatable-container .dataTable th),
	:global(.datatable-container .dataTable td) {
		border-color: var(--bs-border-color);
	}

	:global(.datatable-container .dataTable thead th) {
		background-color: var(--bs-secondary-bg);
		color: var(--bs-emphasis-color);
		font-weight: 600;
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		border-bottom-width: 1px;
	}

	:global(.datatable-container .dataTable tbody td) {
		padding-top: 0.85rem;
		padding-bottom: 0.85rem;
		color: var(--bs-body-color);
	}

	:global(.datatable-container .dataTable tbody tr) {
		transition: background-color 0.15s ease;
	}

	:global(.datatable-container .dataTable tbody tr:hover > *) {
		background-color: rgba(var(--bs-primary-rgb), 0.06);
	}

	:global(.datatable-header) {
		--datatable-header-bg: #323a52;
		--datatable-header-color: #e6ecff;
		background-color: var(--datatable-header-bg);
		color: var(--datatable-header-color);
	}

	:global(.datatable-header th) {
		background-color: inherit;
		color: inherit;
	}

	:global(.table-striped-inverted.table-striped > tbody > tr:nth-of-type(odd) > *) {
		--bs-table-accent-bg: transparent !important;
		color: inherit;
	}

	:global(.table-striped-inverted.table-striped > tbody > tr:nth-of-type(even) > *) {
		--bs-table-accent-bg: var(--bs-table-striped-bg) !important;
		color: var(--bs-table-striped-color);
	}
</style>
