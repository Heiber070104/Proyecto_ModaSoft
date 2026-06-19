<script>
    import can from "$lib/services/guard";
    import TabHead from "$lib/components/global/TabHead.svelte";
    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";
    import Table from "$lib/components/global/Table.svelte";
    import Paginator from "$lib/components/global/Paginator.svelte";
    import PageToolbar from "$lib/components/global/PageToolbar.svelte";
    import CategoriesModal from "$lib/modals/CategoriesModal.svelte";
    import ConfirmModal from "$lib/modals/ConfirmModal.svelte";
    import { notify } from "$lib/services/notify";
    import { createServerTableController } from "$lib/services/tableController";
    import { PERMISSIONS } from "$lib/constants/permissions";
    import { user } from "$lib/stores/session";
    import { categoriesApi } from "$lib/api/categories";
    import { parsePaginator } from "$lib/services/pagination";
    import { onDestroy, onMount } from "svelte";

    const CURRENT_PERMISSIONS = $derived($user?.permissions ?? []);
    const PER_PAGE_OPTIONS = [5, 10, 20, 50, 100]
    const BREADCRUMB_ITEMS = ['ModaSoft','Usuarios'];
    const TABLE_COLUMNS = [ 
        {key: 'name', label: 'Nombre de categoría', sortable: true},
        {key: 'is_active', label: 'Estado', align: 'center'},
        {key: 'actions', label: 'Acciones', align: 'end'}
    ];

    const setFormData = (data = {}) => ({
        name: String(data?.name ?? ''),
        status: Boolean(data?.status ?? true)
    })

    const setFormFieldErrors = (data = {}) => ({
        name: Boolean(data?.name ?? true),
        status: Boolean(data?.status ?? false)
    })

    const setConfirm = (data = {}) => ({
       title: String(data?.title ?? ''),
       message: String(data?.message ?? ''),
       largeMessage: String(data?.largeMessage ?? ''), 
       largeIcon: String(data?.largeIcon ?? ''),
       largeIconColor: String(data?.largeIconColor ?? ''),
       buttonColor: String(data?.buttonColor ?? '')
    });

    let error = $state('');
    let success = $state('');

    let tableItems = $state([]);
    let loading = $state(false);
    let currentPage = $state(1);
    let lastPage = $state(1);
    let totalTableItems = $state(0);
    let fromRow = $state(0);
    let toRow = $state(0);
    let perPage = $state(10);
    let searchTerm = $state('');
    let sortBy = $state(null);
    let sortDirection = $state();

    let openModal = $state(false);
    let isEditModal = $state(false);
    let modalLoading = $state(false);
    let formData = $state(setFormData());
    let formFieldErrors = $state(setFormFieldErrors());
    let editId = $state(null);

    let openConfirmModal = $state(false);
    let deleteId = $state(null);

    let isToggleModal = $state(null);
    let toggleId = $state(null);
    let confirmFields = $state(setConfirm());

    const tableController = createServerTableController({
        getCurrentPage: () => currentPage,
        getLastPage: () => lastPage,
        setPerPage: (value) => { perPage = value; },
        setSearchTerm: (value) => { searchTerm = value },
        setSortState: ({ sortBy: col, direction: dir }) => { 
            sortBy = col; 
            sortDirection = dir; 
        },
        
        loadPage: async (page) => {
            await loadTableItems(page);
        }
    });

    function applyPaginator(nextState) {
        currentPage = nextState.currentPage;
        lastPage = nextState.lastPage;
        perPage = nextState.perPage;
        totalTableItems = nextState.total;
        fromRow = nextState.from;
        toRow = nextState.to;
    }

    async function goToPage(page) {
        console.log(page)
        await tableController.goToPage(page);
    } 

    async function changePerPage(event) {
        const value = event?.value ?? event?.currentTarget?.value;
        await tableController.changePerPage(Number(value)); 
    }
    
    function handleSearch(event) {
        const value = event?.value;
        tableController.search(value); 
	}

    function handleSort(event) {
        let columnKey = event?.identifier;
        const direction = (sortBy === columnKey && sortDirection === 'asc') ? 'desc' : 'asc';
        tableController.sort({ sortBy: columnKey, direction });
    }

    async function loadTableItems(pageOverride = null) {

        loading = true;
        const targetPage = pageOverride ?? currentPage;

        try {
            const response = await categoriesApi.getAll({
                page: targetPage,
                per_page: perPage,
                search: searchTerm,
                sort_by: sortBy,        
                sort_dir: sortDirection
            });

            tableItems = response.data;

            const paginationState = parsePaginator(response, tableItems.length, perPage);
            applyPaginator(paginationState);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                error = `Error al cargar categorias: ${err.response.data.message}`
            } else {
                error = "Error al comunicarse con el servidor";
            }
            console.error("API error: ", err);
        } finally {
            loading = false;
        }
    }

    async function handleSubmit(payload){
        modalLoading = true;
        let message = isEditModal ? 'Actualizada' : 'Creada';
        try{
            if(isEditModal){
                const response = await categoriesApi.update(editId, payload)
            }else{
                const response = await categoriesApi.store(payload);
            } 
            notify.success(`Categoria ${message} exitosamente`);
            closeUserModal();
            loadTableItems();
        }catch(err){
            if (err.response && err.response.data && err.response.data.message) {
                notify.error(`La categoría no pudo ser ${message} debido a un error: ${err.response.data.message}`);
            } else {
                notify.error(`Error al comunicarce con el servidor.`);
            }
            console.error("API error: ", err);
        }finally{
            modalLoading = false;
        }
    }

    async function handleConfirm(){
        if(!deleteId && !isToggleModal || !toggleId && isToggleModal){
            notify.error('Ha ocurrido un error, intente de nuevo.')
            return;
        }
        let message = isToggleModal ? 'Estado cambido exitosamente.' : 'Categoría eliminada exitosamente.';
        let errorMessage = isToggleModal ? 'Error al cambiar el estado: ' : 'La categoría no pudo ser eliminada debido a un error: '
        modalLoading = true;
        try{
            if(isToggleModal){
                const response = await categoriesApi.toggleStatus(toggleId)
            }else{
                const response = await categoriesApi.delete(deleteId);
            }
            notify.success(message);
            closeConfirmModal();
            loadTableItems();
        }catch(err){
            if (err.response && err.response.data && err.response.data.message) {
                notify.error(`${errorMessage} ${err.response.data.message}`);
            } else {
                notify.error(`Error al comunicarce con el servidor.`);
            }
            console.error("API error: ", err);
        }finally{
            modalLoading = false;
        }
    }

    function openCreateModal(){
        formData = setFormData();
        formFieldErrors = setFormFieldErrors();
        openModal = true;
        isEditModal = false;
    }

    function openEditModal(data){
        formData = setFormData(data);
        formFieldErrors = setFormFieldErrors({
            name: false,
            status: false,
        });
        editId = Number(data.id);
        openModal = true;
        isEditModal = true;
    }

    function openDeleteModal(id, name){
        deleteId = Number(id);
        openConfirmModal = true;
        confirmFields = setConfirm({
            title: 'Confirmar eliminar',
            largeMessage: 'Eliminar Categoría',
            message: `La categoría ${name} será eliminada al confirmar ¿Desea continuar?`,
            largeIcon: 'bi bi-trash',
            largeIconColor: 'danger',
            buttonColor: 'danger'
        })
    }

    function openToggleModal(id, name, status){
        toggleId = Number(id);
        openConfirmModal = true;
        isToggleModal = true;
        confirmFields = setConfirm({
            title: status ? 'Confirmar desactivar' : 'Confirmar activar',
            largeMessage: status ? 'Desactivar categoría' : 'Activar categoría',
            message: status ? 
                `La categoría ${name} será desactivada y no se podrá elegir al crear producto ¿Desea continuar?` :
                `La categoría ${name} será activada y se podrá elegir de nuevo al crear producto ¿Desea continuar?`
            ,
            largeIcon: status ? 'bi bi-lock-fill' : 'bi bi-unlock-fill',
            largeIconColor: 'info',
            buttonColor: 'info'
        })
    }

    function closeConfirmModal(){
        deleteId = null;
        toggleId = null;
        confirmFields = setConfirm();
        openConfirmModal = false;
        isToggleModal = false;
    }

    function closeUserModal(){
        formData = setFormData();
        formFieldErrors = setFormFieldErrors();
        openModal = false;
        isEditModal = false;
        editId = null;
    }

    onMount(() => {
        loadTableItems();
    })

    onDestroy(() => {
        tableController.destroy();
    })

</script>

{#if can(CURRENT_PERMISSIONS, PERMISSIONS.VIEW_CATEGORIES)}

    <TabHead title='Categorías' />
    <Breadcrumb items={BREADCRUMB_ITEMS} title='Categorías' />

    <div class='card shadow-sm py-4 px-3 border-0 rounded-4'>
        <PageToolbar 
            {perPage}
            total={totalTableItems}
            perPageOptions={PER_PAGE_OPTIONS}
            showCreateButton={can(CURRENT_PERMISSIONS, PERMISSIONS.CREATE_CATEGORIES)}
            entityLabel='Categorías'
            perPageId='category_per_page' 
            newButtonIcon='bi bi-plus'
            newButtonText='Nueva categoría' 
            onPerPageChange={changePerPage}
            onCreate={openCreateModal}
        />
        <Table
            {loading}
            columns={TABLE_COLUMNS}
            rows={tableItems}
            serverSide
            serverSort={{ identifier: sortBy, direction: sortDirection }}
            searchPlaceholder="Buscar categorías..."
            emptyMessage="No hay categorias registrados"
            showRowsPerPage={false}
            showPagination={false}	
            showRowCount={false}
            select={false}
            onSearchInput={handleSearch}
            onSortChange={handleSort}
        >
            {#snippet cell({row, column, value })}
                {#if column.key === 'is_active'}
                    <div class={`bg-${row.is_active ? 'success' : 'danger'} rounded-5 text-center mt-2 w-5`}>
                        <p><strong>{row.is_active ? 'Activo' : 'Inactivo'}</strong></p>
                    </div>
                {:else if column.key === 'actions'}
                    {#if can(CURRENT_PERMISSIONS, PERMISSIONS.TOGGLE_STATUS_CATEGORIES)}
                        <button
                            title={row.is_active ? 'Desactivar categoria' : 'Activar categoria'}
                            class="btn btn-sm btn-info rounded-3"
                            type="button"
                            onclick={() =>
                                openToggleModal(
                                    row.id,
                                    row.name,
                                    row.is_active,
                                )
                            }
                        >
                            <i class={row.is_active ? 'bi bi-lock-fill' : 'bi bi-unlock-fill'}></i>
                        </button>
                    {/if}
                    {#if can(CURRENT_PERMISSIONS, PERMISSIONS.EDIT_CATEGORIES)}
                        <button
                            title="Editar"
                            class="btn btn-sm btn-success rounded-3"
                            type="button"
                            onclick={() =>
                                openEditModal({
                                    id: row.id,
                                    name: row.name,
                                })
                            }
                        >
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                    {/if}
                    {#if can(CURRENT_PERMISSIONS, PERMISSIONS.DELETE_CATEGORIES)}
                        <button
                            title="Borrar"
                            class="btn btn-sm btn-danger rounded-3"
                            type="button"
                            onclick={() => openDeleteModal(row.id, row.name)}
                        >
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    {/if}
                {:else}
                    {value ?? '-'}
                {/if}

            {/snippet}
        </Table>
        <Paginator
            {loading}
            {currentPage}
            {lastPage}
            total={totalTableItems} 
            from={fromRow}
            to={toRow}
            entityLabel='Categorías'
            onPageChange={(e) => {goToPage(e)}}
        />
    </div>

    <CategoriesModal
        formSubmitting={modalLoading}
        isOpen={openModal}
        isEdit={isEditModal}
        bind:formFieldErrors
        bind:formData
        onClose={closeUserModal}
        onSubmit={(e) => {handleSubmit(e)}}
    />

    <ConfirmModal 
        isOpen={openConfirmModal}
        isSubmitting={modalLoading}
        largeMessage={confirmFields.largeMessage}
        message={confirmFields.message}
        title={confirmFields.title}
        largeIcon={confirmFields.largeIcon}
        largeIconColor={confirmFields.largeIconColor}
        buttonColor={confirmFields.buttonColor}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
    />

{:else}
    <div class="card shadow-sm border-0 rounded-4 p-4 mt-3">
        <h5 class="mb-2">Vista no disponible</h5>
    </div>
{/if}
