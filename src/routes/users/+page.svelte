<script>
    import can from "$lib/services/guard";
    import TabHead from "$lib/components/global/TabHead.svelte";
    import Breadcrumb from "$lib/components/global/Breadcrumb.svelte";
    import Table from "$lib/components/global/Table.svelte";
    import Paginator from "$lib/components/global/Paginator.svelte";
    import PageToolbar from "$lib/components/global/PageToolbar.svelte";
    import UsersModal from "$lib/modals/UsersModal.svelte";
    import ConfirmModal from "$lib/modals/ConfirmModal.svelte";
    import { notify } from "$lib/services/notify";
    import { createServerTableController } from "$lib/services/tableController";
    import { PERMISSIONS } from "$lib/constants/permissions";
    import { user } from "$lib/stores/session";
    import { usersApi } from "$lib/api/users";
    import { parsePaginator } from "$lib/services/pagination";
    import { onDestroy, onMount } from "svelte";

    const CURRENT_PERMISSIONS = $derived($user?.permissions ?? []);
    const PER_PAGE_OPTIONS = [5, 10, 20, 50, 100]
    const BREADCRUMB_ITEMS = ['ModaSoft','Usuarios'];
    const TABLE_COLUMNS = [ 
        {key: 'username', label: 'Nombre de usuario', sortable: true},
        {key: 'personal_name', label: 'Nombre personal', sortable: true},
        {key: 'email', label: 'Correo', sortable: true},
        {key: 'is_active', label: 'Estado', align: 'center'},
        {key: 'actions', label: 'Acciones', align: 'end'}
    ];

    const setFormData = (data = {}) => ({
        username: String(data?.username ?? ''),
        personal_name: String(data?.personal_name ?? ''),
        email: String(data?.email ?? ''),
        role: String(data?.role ?? ''),
        password: '',
        confirm_password: '',
    })

    const setFormFieldErrors = (data = {}) => ({
        username: Boolean(data?.username ?? true),
        personal_name: Boolean(data?.personal_name ?? true),
        email: Boolean(data?.email ?? true),
        role: Boolean(data?.role ?? true),
        password: Boolean(data?.password ?? true),
        confirm_password: Boolean(data?.confirm_password ?? true),
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

    let openUserModal = $state(false);
    let isEditUserModal = $state(false);
    let modalLoading = $state(false);
    let formData = $state(setFormData());
    let formFieldErrors = $state(setFormFieldErrors());
    let editUserId = $state(null);

    let openConfirmModal = $state(false);
    let deleteUserId = $state(null);

    let isToggleModal = $state(null);
    let toggleUserId = $state(null);
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
            const response = await usersApi.getAll({
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
                error = `Error al cargar usuarios: ${err.response.data.message}`
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
        let message = isEditUserModal ? 'Actualizado' : 'Creado';
        try{
            if(isEditUserModal){
                const response = await usersApi.update(editUserId, payload)
            }else{
                const response = await usersApi.store(payload);
            } 
            notify.success(`Usuario ${message} exitosamente`);
            closeUserModal();
            loadTableItems();
        }catch(err){
            if (err.response && err.response.data && err.response.data.message) {
                notify.error(`El usuario no pudo ser ${message} debido a un error: ${err.response.data.message}`);
            } else {
                notify.error(`Error al comunicarce con el servidor.`);
            }
            console.error("API error: ", err);
        }finally{
            modalLoading = false;
        }
    }

    async function handleConfirm(){
        if(!deleteUserId && !isToggleModal || !toggleUserId && isToggleModal){
            notify.error('Ha ocurrido un error, intente de nuevo')
            return;
        }
        let message = isToggleModal ? 'Estado cambido exitosamente.' : 'Usuario eliminado exitosamente.';
        let errorMessage = isToggleModal ? 'Error al cambiar el estado, intente nuevamente.' : 'El usuario no pudo ser eliminado debido a un error, intente de nuevo.'
        modalLoading = true;
        try{
            if(isToggleModal){
                const response = await usersApi.toggleStatus(toggleUserId)
            }else{
                const response = await usersApi.delete(deleteUserId);
            }
            notify.success(message);
            closeConfirmModal();
            loadTableItems();
        }catch(err){
            if (err.response && err.response.data && err.response.data.message) {
                notify.error(errorMessage);
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
        openUserModal = true;
        isEditUserModal = false;
    }

    function openEditModal(data){
        formData = setFormData(data);
        formFieldErrors = setFormFieldErrors({
            username: false,
            personal_name: false,
            email: false,
            role: false,
            password: false,
            confirm_password: false
        });
        editUserId = Number(data.id);
        openUserModal = true;
        isEditUserModal = true;
    }

    function openDeleteModal(id, username){
        deleteUserId = Number(id);
        openConfirmModal = true;
        confirmFields = setConfirm({
            title: 'Confirmar eliminar',
            largeMessage: 'Eliminar Usuario',
            message: `El usuario ${username} será eliminado al confirmar ¿Desea continuar?`,
            largeIcon: 'bi bi-trash',
            largeIconColor: 'danger',
            buttonColor: 'danger'
        })
    }

    function openToggleModal(id, username, status){
        toggleUserId = Number(id);
        openConfirmModal = true;
        isToggleModal = true;
        confirmFields = setConfirm({
            title: status ? 'Confirmar desactivar' : 'Confirmar activar',
            largeMessage: status ? 'Desactivar usuario' : 'Activar usuario',
            message: status ? 
                `El usuario ${username} será desactivado y no podrá iniciar sesíon ¿Desea continuar?` :
                `El usuario ${username} será activado y podrá iniciar sesíon de nuevo ¿Desea continuar?`
            ,
            largeIcon: status ? 'bi bi-person-lock' : 'bi bi-person-check',
            largeIconColor: 'info',
            buttonColor: 'info'
        })
    }

    function closeConfirmModal(){
        deleteUserId = null;
        toggleUserId = null;
        confirmFields = setConfirm();
        openConfirmModal = false;
        isToggleModal = false;
    }

    function closeUserModal(){
        formData = setFormData();
        formFieldErrors = setFormFieldErrors();
        openUserModal = false;
        isEditUserModal = false;
        editUserId = null;
    }

    onMount(() => {
        loadTableItems();
    })

    onDestroy(() => {
        tableController.destroy();
    })

</script>

{#if can(CURRENT_PERMISSIONS, PERMISSIONS.VIEW_USERS)}

    <TabHead title='Usuarios' />
    <Breadcrumb items={BREADCRUMB_ITEMS} title='Usuarios' />

    <div class='card shadow-sm py-4 px-3 border-0 rounded-4'>
        <PageToolbar 
            {perPage}
            total={totalTableItems}
            perPageOptions={PER_PAGE_OPTIONS}
            showCreateButton={can(CURRENT_PERMISSIONS, PERMISSIONS.CREATE_USERS)}
            entityLabel='Usuarios'
            perPageId='users_per_page' 
            newButtonIcon='bi bi-person-plus-fill'
            newButtonText='Nuevo usuario' 
            onPerPageChange={changePerPage}
            onCreate={openCreateModal}
        />
        <Table
            {loading}
            columns={TABLE_COLUMNS}
            rows={tableItems}
            serverSide
            serverSort={{ identifier: sortBy, direction: sortDirection }}
            searchPlaceholder="Buscar usuarios..."
            emptyMessage="No hay usuarios registrados"
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
                    {#if can(CURRENT_PERMISSIONS, PERMISSIONS.TOGGLE_STATUS_USERS)}
                        <button
                            title={row.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                            class="btn btn-sm btn-info rounded-3"
                            type="button"
                            onclick={() =>
                                openToggleModal(
                                    row.id,
                                    row.username,
                                    row.is_active,
                                )
                            }
                        >
                            <i class={row.is_active ? 'bi bi-person-lock' : 'bi bi-person-check'}></i>
                        </button>
                    {/if}
                    {#if can(CURRENT_PERMISSIONS, PERMISSIONS.EDIT_USERS)}
                        <button
                            title="Editar"
                            class="btn btn-sm btn-success rounded-3"
                            type="button"
                            onclick={() =>
                                openEditModal({
                                    id: row.id,
                                    username: row.username,
                                    personal_name: row.personal_name,
                                    email: row.email,
                                    role: row.roles[0]?.name
                                })
                            }
                        >
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                    {/if}
                    {#if can(CURRENT_PERMISSIONS, PERMISSIONS.DELETE_USERS)}
                        <button
                            title="Borrar"
                            class="btn btn-sm btn-danger rounded-3"
                            type="button"
                            onclick={() => openDeleteModal(row.id, row.username)}
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
            entityLabel='Usuarios'
            onPageChange={(e) => {goToPage(e)}}
        />
    </div>

    <UsersModal 
        formSubmitting={modalLoading}
        isOpen={openUserModal}
        isEdit={isEditUserModal}
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
