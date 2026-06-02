import axios from 'axios';

const DEFAULT_URL_API = import.meta.env.VITE_API_URL || 'https://modasoft-backend.test/api';
const API_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_URL_API;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;