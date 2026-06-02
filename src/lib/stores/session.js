import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const getInitialUser = () => {
    if (browser) {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error('Corrupted user data in localStorage:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                return null;
            }
        }
    }
    return null;
};

const getInitialAuth = () => {
    if (browser) {
        return localStorage.getItem('token') !== null;
    }
    return false;
};

export const user = writable(getInitialUser());
export const isAuthenticated = writable(getInitialAuth());

export const setSession = async (userData, token) => {   
    user.set(userData);
    isAuthenticated.set(true);
    
    if (browser) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    }
};

export const destroySession = () => {
    user.set(null);
    isAuthenticated.set(false);
    
    if (browser) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const refreshSession = async (userData) => {
    user.set(userData);
    if (browser) {
        localStorage.setItem('user', JSON.stringify(userData));
    }
}
    
       
