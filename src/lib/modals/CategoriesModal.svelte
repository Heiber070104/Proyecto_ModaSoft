<script>

    import Input from "$lib/components/global/Input.svelte";
    import Select from "$lib/components/global/Select.svelte"
    import { fade, scale } from "svelte/transition";
    import { backOut } from "svelte/easing";

    const SELECT_STATUS = [
        {value: true, label: 'Activo'},
        {value: false, label: 'Inactivo'}
    ]
    const RULES = {
		required: (v) => !!v || 'Este campo no puede estar vacio',
		no_numbers: (v) => !/\d/.test(v) || 'No se permiten números',
    }

    let {
        formFieldErrors = $bindable({}),
        formData = $bindable({}),
        isOpen = false,
        isEdit = false,
        loading = false,
        formSubmitting = false,
        modalError = '',
        onSubmit = () => {},
        onClose = () => {},
    } = $props();

    let existsFieldErrors = $derived(
        Object.values(formFieldErrors).some((errorValue) => errorValue === true)
    );

    let validationErrorMessage = $derived.by(() => {
        if(formData.name === ''){
            return 'Loas campos marcados con *  no pueden estar vacios.';
        }else if (existsFieldErrors){
            return 'Existen uno o varios campos con error.'
        }
        return '';
    })

    function buildPayload(data){
        if(existsFieldErrors){
            return null;
        }
        let payload = {
            name: String(data.name)
        }
        if(!isEdit && (data.status !== undefined || data.status !== null)){
            payload.is_active = data.status;
        }
        return payload;
    }

    async function handleSubmit(){
        const payload = buildPayload(formData)
        if(!payload){
            return;
        }
        onSubmit?.(payload)
    }

    function handleClose(){
        if(formSubmitting) return;
        onClose();
    }

    function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}

    function handleInputError(field, value){
        formFieldErrors[field] = value;
    }

</script>

{#if isOpen}

    <div class='crud-modal-backdrop' role='presentation' transition:fade={{ duration: 200 }} onclick={handleBackdropClick}>

        <div class='crud-modal card shadow-lg' role='dialog' transition:scale={{  duration: 400, start: 0.8, easing: backOut }}>

            <div class='card-header justify-content-between d-flex align-items-center'>
                <p class='h5 mt-2'>{isEdit ? 'Editar categoría' : 'Crear categoría'}</p>
                <button class="btn btn-outline-secondary me-2" style="border: none;" aria-label='Cerrar' onclick={handleClose}><i class='bi bi-x-lg'></i></button>
            </div>

            <div class='card-body'>
                {#if !loading}
                    <div class="row g-3">
                        <div class="col-{isEdit ? '12' : '6'}">
                            <Input  
                                id='name'
                                label='Nombre *'
                                rules={[RULES.required, RULES.no_numbers]}
                                bind:value={formData.name}
                                onError={(e) => {handleInputError('name', e)}} 
                            />
                        </div>
                        {#if !isEdit}
                            <div class="col-6">
                                <Select  
                                    id='status'
                                    label='Estado por defecto *'
                                    options={SELECT_STATUS}
                                    bind:value={formData.status}
                                    onError={(e) => {handleInputError('status', e)}}
                                />
                            </div>
                        {/if}
                    </div>
                    <div class="d-flex justify-content-between mt-3">
                        <div>
                            {#if validationErrorMessage}
                                <small class='text-muted'><strong>{validationErrorMessage}</strong></small>
                            {/if}
                        </div>
                        <div class="gap-2">
                            <button
                                class="btn btn-secondary"
                                onclick={handleClose}
                                disabled={formSubmitting}
                            >
                                Cancelar
                            </button>

                            <button class="btn btn-primary" disabled={formSubmitting || existsFieldErrors} onclick={handleSubmit}>
                                <span class="d-inline-flex align-items-center gap-1">
                                    <i class={isEdit ? 'bi bi-check' : 'bi bi-plus'}></i>
                                    <span>
                                        { formSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
                                    </span>
                                </span>
                            </button>
                        </div>
					</div>
                {:else}
                    <div class="text-center py-4 text-muted">Cargando...</div>
                {/if}
            </div>

        </div>

    </div>

{/if}

<style>
    .crud-modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 2050;
		background: rgba(9, 13, 25, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.crud-modal {
		width: min(900px, 100%);
		max-height: calc(100vh - 2rem);
		overflow-y: auto;
		border-radius: 16px;
		border: 1px solid var(--bs-border-color);
		box-shadow: 0 24px 48px rgba(0, 0, 0, 0.24);
	}
</style>