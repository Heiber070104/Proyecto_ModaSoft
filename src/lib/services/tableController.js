import debounce from './debounce.js';
/**
 * Crea el controlador para la tabla del servidor.
 * @param {Object} options - Las opciones y funciones del controlador.
 */
export function createServerTableController(options) {
    
    const debouncedSearch = debounce(() => {
        options.loadPage(1);
    }, options.debounceMs ?? 500);

    return {
        destroy() {
            debouncedSearch.cancel();
        },

        async changePerPage(nextPerPage) {
            debouncedSearch.cancel();
            options.setPerPage(nextPerPage);
            await options.loadPage(1);
        },

        async goToPage(page) {
            const currentPage = options.getCurrentPage();
            const lastPage = options.getLastPage();

            if (page < 1 || page > lastPage || page === currentPage) {
                return;
            }

            debouncedSearch.cancel();
            await options.loadPage(page);
        },

        search(value, filter = "") {
            options.setSearchTerm(value, filter);
            debouncedSearch(); 
        },

        async filter(value){
            options.setFilterValue(value);
            await options.loadPage(1);
        },

        async sort(payload) {
            debouncedSearch.cancel();
            
            options.setSortState({
                sortBy: payload.sortBy ?? null,
                direction: payload.direction ?? null
            });
        
            await options.loadPage(1);
        }
    };
}