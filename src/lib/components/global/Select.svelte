<script>

    let {
        id = '',
        label = 'Selector',
        placeholder = 'Seleccione...',
        value = $bindable(''),
        disabled = false,
        required = true,
        options = [],
        onError = () => {}
    } = $props();

    let errorMessage = $state('');
    let touched = $state(false);

    $effect(() => {
        if (disabled) {
            onError(false)
        }
    })

    $effect(() => {
        if(touched){
            validate();
        }
    })

    function validate(){
        if(required && value === ''){
            errorMessage = 'Este campo no puede estar vacio'
            onError(true)
            return;
        }
        onError(false)
    }

</script>

<div class='mb-3'>

    <label class="form-label" for={id}>{label}</label>

    <select 
        {id}
        {disabled} 
        class="form-select" 
        aria-label="Seleccione" 
        bind:value 
        onchange={() => {touched = true}}
    >
        <option value="" hidden selected>{placeholder}</option>
        {#each options as option}
            <option value={option?.value}>
                {option?.label ?? option.value}
            </option>
        {/each}
    </select>   

    {#if errorMessage && !disabled }
        <div class="invalid-feedback d-block">
            {errorMessage}
        </div>
    {/if}

</div>
