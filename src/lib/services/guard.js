
export default function can(permissions = [], permission) {
    if (!permission) {
        return true;
    }

    return Array.isArray(permissions) && permissions.includes(permission);
}
