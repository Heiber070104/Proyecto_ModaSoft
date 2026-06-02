// Exportamos el arreglo con las rutas del menú
export const navigationModules = [
    { name: 'Dashboard', ref: '/dashboard', icon: 'bi-speedometer2', roles: ['admin', 'user'] },
    { name: 'Inventorio', ref: '/inventory', icon: 'bi-box-seam', roles: ['admin', 'user'] },
    { name: 'Ventas', ref: '/sales', icon: 'bi-receipt', roles: ['admin'] },
    { name: 'Compras', ref: '/purchases', icon: 'bi-bag-check', roles: ['admin'] },
    { name: 'Usuario', ref: '/users', icon: 'bi-people', roles: ['admin'] }
];
