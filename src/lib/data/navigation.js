import {PERMISSIONS} from '$lib/constants/permissions.js'
// Exportamos el arreglo con las rutas del menú
export const navigationModules = [
    { name: 'Panel principal', ref: '/dashboard', icon: 'bi-speedometer2', permission: PERMISSIONS.VIEW_REPORTS },
    { name: 'Productos', ref: '/products', icon: 'bi-cart', permission: PERMISSIONS.VIEW_PRODUCTS },
    { name: 'Tallas', ref: '/sizes', icon: 'bi-rulers', permission: PERMISSIONS.VIEW_SIZES },
    { name: 'Categorías', ref: '/categories', icon: 'bi-tags', permission: PERMISSIONS.VIEW_CATEGORIES },
    { name: 'Compradores', ref: '/customers', icon: 'bi-currency-dollar', permission: PERMISSIONS.VIEW_CUSTOMERS },
    { name: 'Proveedores', ref: '/suppliers', icon: 'bi-truck', permission: PERMISSIONS.VIEW_SUPPLIERS },
    { name: 'Ventas', ref: '/sales', icon: 'bi-receipt', permission: PERMISSIONS.VIEW_SALES },
    { name: 'Compras', ref: '/purchases', icon: 'bi-bag-check', permission: PERMISSIONS.VIEW_PURCHASES },
    { name: 'Usuario', ref: '/users', icon: 'bi-people', permission: PERMISSIONS.VIEW_USERS }
];
