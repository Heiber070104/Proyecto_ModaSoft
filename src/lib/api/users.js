import api from './api.js';

const ENDPOINT = '/users';

export const usersApi = {
    getAll: async (params = {}) => {
        const response = await api.get(ENDPOINT, { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    }, 
    store: async (userData) => {
        const response = await api.post(ENDPOINT, userData);
        return response.data;
    },
    update: async (id, userData) => {
        const response = await api.put(`${ENDPOINT}/${id}`, userData);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`${ENDPOINT}/${id}`);
    }
}