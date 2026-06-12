<script>

    import { scale, fade } from "svelte/transition";
    import { backOut } from "svelte/easing";

    let {
        isOpen = false,
        isSubmitting = false,
        title = 'Confirme',
        largeMessage = 'Confirmación requerida',
        message = '¿Desea continuar?',
        largeIcon = 'bi bi-exclamation-circle',
        largeIconColor = 'info',
        buttonMessage = 'Confirmar',
        buttonIcon = 'bi bi-check-lg',
        onConfirm = () => {},
        onClose = () => {},
    } = $props();

    function handleClose(){
        onClose();
    }

    function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}

    function handleConfirm(){
        onConfirm();
    }

</script>

{#if isOpen}

    <div class='crud-modal-backdrop' role='presentation' transition:fade={{ duration: 200 }} onclick={handleBackdropClick}>

        <div class='crud-modal card shadow-lg' role='dialog' transition:scale={{  duration: 400, start: 0.8, easing: backOut }}>

            <div class='card-header justify-content-between d-flex'>
                <p class='h5 mt-2'>{title}</p>
                <button class="btn btn-outline-secondary me-2" style="border: none;" aria-label='Cerrar' onclick={handleClose}><i class='bi bi-x-lg'></i></button>
            </div>
            <div class='card-body d-flex flex-column gap-2 align-items-center justify-content-center me-3 ms-3'>
                <i class={`${largeIcon} display-4 text-${largeIconColor}`}></i>
                <p class='h2'>{largeMessage}</p>
                <p class='h5 text-muted'>{message}</p>
            </div>
            <div class='d-flex justify-content-end p-3 gap-1'>
                <button
                    class='btn btn-secondary'
                    onclick={handleClose}
                >
                    Cancelar
                </button>
                <button
                    disabled={isSubmitting}
                    class='btn btn-primary'
                    onclick={handleConfirm}
                >
                    <i class={buttonIcon}></i>
                    {isSubmitting ? 'Cargando...' : buttonMessage}
                </button>
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
		min-width: 500px;
		max-height: calc(100vh - 2rem);
		overflow-y: auto;
		border-radius: 16px;
		border: 1px solid var(--bs-border-color);
		box-shadow: 0 24px 48px rgba(0, 0, 0, 0.24);
	}
</style>