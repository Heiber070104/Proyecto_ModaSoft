<script>
    import { createEventDispatcher } from 'svelte';

    let {
        value = $bindable(''),
        label = 'Campo',
        type = 'text',
        rules = [],
        isTextArea = false,
        disabled = false,
        id = '',
        placeholder = "",
        rows = 3,
        passwordField = false,
        onInput = () => {},
        onError = () => {},
        onBlur = () => {}
    } = $props();

    const dispatch = createEventDispatcher();

    let errorMessage = $state('');
    let touched = $state(false);
    let showPassword = $state(false);

    $effect(() => {
        if (disabled) {
            onError(false)
        }
    })

    $effect (() => { 
        if (touched && (rules || value !== undefined)) {
            validate();
        }
    })

    function markAsTouched() {
        touched = true;
    }

    function autoAdjust(node) {
        function adjust() {
            node.style.height = 'auto';
            node.style.height = node.scrollHeight + 'px';
        }

        node.addEventListener('input', adjust);

        setTimeout(adjust, 10);

        return {
            destroy() {
                node.removeEventListener('input', adjust);
            }
        };
    }

    function validate() {
        for (let regla of rules) {
            const result = regla(value);

            if (typeof result === 'string') {
                errorMessage = result;
                onError(true);
                return;
            }
        }

        errorMessage = '';
        onError(false);
    }

	function handleInput() {
		validate();
		markAsTouched();
		onInput(value);
	}

	function handleBlur() {
		validate();
		markAsTouched();
		onBlur(value);
	}
</script>

<div class="mb-3">
 
    <label class="form-label" for={id}>{label}</label>

    {#if isTextArea}
        <textarea
          {id}
          class="form-control {errorMessage && !disabled ? 'is-invalid' : ''}"
          {rows}
          {disabled}
          {placeholder}
          bind:value
          use:autoAdjust
          style="overflow-y: hidden; resize: none;"
          oninput={handleInput}
          onblur={handleBlur}
        ></textarea>
    {:else}
        <div class="input-wrapper">

            <input
                {id}
                type={ !passwordField ? type : showPassword ? 'text' : 'password' }
                class="form-control {errorMessage && !disabled ? 'is-invalid' : ''}"
                {disabled}
                {placeholder}
                bind:value
                oninput={handleInput}
                onblur={handleBlur}
            />

            {#if passwordField}
                <button
                    type="button"
                    class="password-toggle {errorMessage ? 'me-4' : ''}"
                    onclick={() => (showPassword = !showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    disabled={disabled}
                >
                    <i class={`bx ${showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}`} ></i>
                </button>
            {/if}
     
        </div>
    {/if}

    {#if errorMessage && !disabled}
        <div class="invalid-feedback d-block">
            {errorMessage}
        </div>
    {/if}
</div>

<style>
    .input-wrapper {
        position: relative;
    }

    .with-toggle {
        padding-right: 2.5rem;
    }

    .password-toggle {
        position: absolute;
        top: 50%;
        right: 0.75rem;
        transform: translateY(-50%);
        border: 0;
        background: transparent;
        color: #6c757d;
        line-height: 1;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .password-toggle:focus {
        outline: none;
        box-shadow: none;
    }

    .password-toggle:disabled {
        cursor: not-allowed;
        opacity: 0.65;
    }

    .password-toggle i {
        font-size: 1rem;
    }
</style>
