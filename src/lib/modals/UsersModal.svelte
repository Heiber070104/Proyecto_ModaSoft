<script>

    import { ROLES } from "$lib/constants/roles";
    import Input from "$lib/components/global/Input.svelte";
    import Select from "$lib/components/global/Select.svelte"
    import { fade, scale } from "svelte/transition";
    import { backOut } from "svelte/easing";
    import { form } from "$app/server";
    import { onMount } from "svelte";
    import { usersApi } from "$lib/api/users";

    const SELECT_ROLES = [
        {value: ROLES.ADMIN, label: 'Administrador'},
        {value: ROLES.MANAGER, label: 'Gerente'},
        {value: ROLES.SELLER, label: 'Vendedor'},
        {value: ROLES.BUYER, label: 'Comprador'},
        {value: ROLES.ACCOUNTANT, label: 'Contador'}
    ]

    const RULES = {
		required: (v) => !!v || 'Este campo no puede estar vacio',
		max255: (v) => String(v ?? '').length <= 255 || 'Supera el máximo permitido de 255 caracteres.',
		email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Formato de correo inválido',
		no_numbers: (v) => !/\d/.test(v) || 'No se permiten números',
		one_upper: (v) =>
			!v || /[A-Z]/.test(v) || 'La contraseña debe contener al menos una mayúscula.',
		one_lower: (v) =>
			!v || /[a-z]/.test(v) || 'La contraseña debe contener al menos una minúscula.',
		one_number: (v) => !v || /\d/.test(v) || 'La contraseña debe contener al menos un número.',
		one_special_character: (v) =>
			!v ||
			/[@$!%*?.+&]/.test(v) ||
			'La contraseña debe contener al menos un carácter especial (@$!%*?.+&).',
		confirm_password: (v) => {
			const passwordValue = String(formData.password ?? '');
			const confirmValue = String(v ?? '');

			if (passwordValue === '' && confirmValue === '') return true;
			return confirmValue === passwordValue || 'Las contraseñas no coinciden';
		},
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

    function hasEmptyFields (data = {}, nullableFields = []) {
        return Object.entries(data).some(([key, value]) => {
            if(isEdit && nullableFields.includes(key)){
                return false;
            }
            return value === '';
        })
    }

    let validationErrorMessage = $derived.by(() => {
        const nullableFields = ['password', 'confirm_password']
        if(hasEmptyFields(formData, nullableFields)){
            return 'Loas campos marcados con *  no pueden estar vacios.';
        }else if (existsFieldErrors){
            return 'Existen uno o varios campos con error.'
        }
        return '';
    })

    let passwordRules = $derived.by(() => {
        return isEdit 
        ? [
            RULES.one_lower, 
            RULES.one_upper, 
            RULES.one_number, 
            RULES.one_special_character
        ]
		: [
            RULES.required,
            RULES.one_lower,
            RULES.one_upper,
            RULES.one_number,
            RULES.one_special_character
		];
    })

    function buildPayload(data){
        const nullableFields = ['password', 'confirm_password']
        if(hasEmptyFields(data, nullableFields)){
            return null;
        }
        let payload = {
            username: String(data.username),
            personal_name: String(data.personal_name),
            email: String(data.email),
            role: String(data.role)
        }
        const passwordIsEmpty = data.password === '' && data.confirm_password === '';
        if(!isEdit || isEdit && !passwordIsEmpty){
            payload.password = String(data.password);
            payload.password_confirmation = String(data.confirm_password)
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
                <p class='h5 mt-2'>{isEdit ? 'Editar usuario' : 'Crear usuario'}</p>
                <button class="btn btn-outline-secondary me-2" style="border: none;" aria-label='Cerrar' onclick={handleClose}><i class='bi bi-x-lg'></i></button>
            </div>

            <div class='card-body'>
                {#if !loading}
                    <div class="row g-3">
                        <div class="col-6">
                            <Input  
                                id='username'
                                label='Nombre de usuario *'
                                rules={[RULES.required]}
                                bind:value={formData.username}
                                onError={(e) => {handleInputError('username', e)}} 
                            />
                        </div>
                        <div class="col-6">
                            <Input  
                                id='personal_name'
                                label='Nombre personal *'
                                rules={[RULES.required, RULES.no_numbers]}
                                bind:value={formData.personal_name}
                                onError={(e) => {handleInputError('personal_name', e)}} 
                            />
                        </div>
                        <div class="col-6">
                            <Input  
                                id='email'
                                label='Correo Electrónico *'
                                rules={[RULES.required, RULES.email]}
                                bind:value={formData.email}
                                onError={(e) => {handleInputError('email', e)}} 
                            />
                        </div>
                        <div class="col-6">
                            <Select  
                                id='role'
                                label='Rol *'
                                options={SELECT_ROLES}
                                bind:value={formData.role}
                                onError={(e) => {handleInputError('role', e)}}
                            />
                        </div>
                        <div class="col-6">
                            <Input  
                                id='password'
                                label={`Contraseña ${isEdit ? '' : '*'}`}
                                placeholder={isEdit ? 'Deja vacio para no cambiar' : ''}
                                passwordField={true}
                                rules={passwordRules}
                                bind:value={formData.password}
                                onError={(e) => {handleInputError('password', e)}} 
                            />
                        </div>
                        <div class="col-6">
                            <Input  
                                id='confirm_password'
                                label={`Confirme contraseña ${isEdit ? '' : '*'}`}
                                placeholder={isEdit ? 'Deja vacio para no cambiar' : ''}
                                passwordField={true}
                                rules={[RULES.confirm_password]}
                                bind:value={formData.confirm_password}
                                onError={(e) => {handleInputError('confirm_password', e)}} 
                            />
                        </div>
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
                                    <i class={isEdit ? 'bi bi-person-check-fill' : 'bi bi-person-plus'}></i>
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