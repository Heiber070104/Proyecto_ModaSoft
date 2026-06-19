<script>
	import { toastStore } from '$lib/stores/toast';

	const colorClass = {
		success: 'text-bg-success',
		danger: 'text-bg-danger',
		warning: 'text-bg-warning',
		primary: 'text-bg-primary',
		info: 'text-bg-info',
		secondary: 'text-bg-secondary'
	};

	const iconClass = {
		success: 'bi-check-circle-fill',
		danger: 'bi-x-circle-fill',
		warning: 'bi-exclamation-triangle-fill',
		primary: 'bi-info-circle-fill',
		info: 'bi-info-circle-fill',
		secondary: 'bi-bell-fill'
	};

	function getColorClass(color) {
		return colorClass[color] ?? colorClass.primary;
	}

	function getIconClass(color) {
		return iconClass[color] ?? iconClass.primary;
	}

	function getCloseClass(color) {
		return color === 'warning' || color === 'info' || color === 'success' ? 'btn-close' : 'btn-close btn-close-white';
	}
</script>

<div class="toast-stack position-fixed top-0 end-0 p-3" aria-live="polite" aria-atomic="true">
	{#each $toastStore as toast (toast.id)}
		<div
			class={`toast show border-0 shadow-lg mb-2 toast-slide ${toast.closing ? 'toast-slide-out' : ''} ${getColorClass(toast.color)}`}
			role={toast.color === 'danger' ? 'alert' : 'status'}
			aria-live={toast.color === 'danger' ? 'assertive' : 'polite'}
			aria-atomic="true"
		>
			<div class="toast-header bg-transparent border-0 text-reset">
				<i class={`bi ${getIconClass(toast.color)} me-2`} aria-hidden="true"></i>
				<strong class="me-auto">{toast.title}</strong>
				<button
					type="button"
					class={getCloseClass(toast.color)}
					aria-label="Cerrar"
					onclick={() => toastStore.remove(toast.id)}
				></button>
			</div>

			{#if toast.message}
				<div class="toast-body pt-0">
					{toast.message}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.toast-stack {
		z-index: 5000;
		max-width: min(100vw, 420px);
		pointer-events: none;
	}

	.toast {
		width: min(360px, calc(100vw - 2rem));
		pointer-events: auto;
	}

	.toast-slide {
		animation: toast-slide-in 0.28s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}

	.toast-slide-out {
		animation: toast-slide-out 0.24s ease-in both;
	}

	.toast-header {
		color: inherit;
	}

	@keyframes toast-slide-in {
		from {
			opacity: 0;
			transform: translateX(calc(100% + 1rem));
		}

		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes toast-slide-out {
		from {
			opacity: 1;
			transform: translateX(0);
		}

		to {
			opacity: 0;
			transform: translateX(calc(100% + 1rem));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.toast-slide,
		.toast-slide-out {
			animation-duration: 1ms;
		}
	}
</style>
