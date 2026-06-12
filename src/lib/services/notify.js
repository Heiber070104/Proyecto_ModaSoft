import { toastStore } from '$lib/stores/toast';

export const notify = {
	success(message, options = {}) {
		return toastStore.success(message, options);
	},

	error(message, options = {}) {
		return toastStore.error(message, options);
	},

	warning(message, options = {}) {
		return toastStore.warning(message, options);
	},

	info(message, options = {}) {
		return toastStore.info(message, options);
	},

	show(options = {}) {
		return toastStore.push(options);
	}
};