import { writable } from 'svelte/store';

const EXIT_ANIMATION_MS = 240;

function createToastStore() {
	const { subscribe, update } = writable([]);

	function push({
        title = 'Notificación',
        message = '',
        color = 'primary',
        delay = 7000,
        autohide = true
    }) {
		const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

		const toast = {
			id,
			title,
			message,
			color,
			delay,
			autohide,
			closing: false
		};

		update((items) => [...items, toast]);

		if (autohide && delay > 0) {
			setTimeout(() => {
				remove(id);
			}, delay);
		}

		return id;
	}

	function remove(id) {
		update((items) =>
			items.map((item) => (item.id === id ? { ...item, closing: true } : item))
		);

		setTimeout(() => {
			update((items) => items.filter((item) => item.id !== id));
		}, EXIT_ANIMATION_MS);
	}

	function clear() {
		update(() => []);
	}

	return {
		subscribe,
		push,
		remove,
		clear,
		success(message, options = {}) {
			return push({
				title: options.title || 'Éxito',
				message,
				color: 'success',
				...options
			});
		},
		error(message, options = {}) {
			return push({
				title: options.title || 'Error',
				message,
				color: 'danger',
				...options
			});
		},
		warning(message, options = {}) {
			return push({
				title: options.title || 'Advertencia',
				message,
				color: 'warning',
				...options
			});
		},
		info(message, options = {}) {
			return push({
				title: options.title || 'Información',
				message,
				color: 'primary',
				...options
			});
		}
	};
}

export const toastStore = createToastStore();
