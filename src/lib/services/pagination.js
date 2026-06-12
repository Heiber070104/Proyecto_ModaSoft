
/**
 * Asegura que el número de items por página sea válido.
 * @param {number|string} value - El valor a comprobar.
 * @param {number} [fallback=50] - Valor por defecto si falla.
 * @param {number} [max=100] - Valor máximo permitido.
 * @returns {number}
 */
export function clampPerPage(value, fallback = 50, max = 100) {
    const parsed = Number(value);
    
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
    }

    return Math.max(1, Math.min(max, parsed));
}

/**
 * Convierte la respuesta de la API (Laravel) en un objeto de estado limpio.
 * @param {Object} payload - La data que viene del servidor (response.data).
 * @param {number} fallbackLength - Longitud del array de datos (si la API no manda total).
 * @param {number} fallbackPerPage - Cuantos items por página por defecto.
 * @returns {Object} El estado de paginación listo para usar.
 */
export function parsePaginator(payload, fallbackLength, fallbackPerPage) {

    const source = payload ?? {};

    const resolvedPerPage = clampPerPage(Number(source.per_page ?? source.meta.per_page), fallbackPerPage);
    const total = Number(source?.total ?? source?.meta?.total ?? fallbackLength ?? 0);
    const from = Number(source?.from ?? source?.meta?.from ??  (fallbackLength > 0 ? 1 : 0));
    const to = Number(source?.to ?? source?.meta?.to ?? fallbackLength ?? 0);

    return {
        currentPage: Number(source?.current_page ?? source?.meta?.current_page ??  1),
        lastPage: Number(source?.last_page ?? source?.meta?.last_page ?? 1),
        perPage: resolvedPerPage,
        total,
        from: total > 0 ? from : 0,
        to: total > 0 ? to : 0
    };
}