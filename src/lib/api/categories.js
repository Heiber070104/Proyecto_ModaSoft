import api from './api.js';

const ENDPOINT = '/categories';

export const categoriesApi = {
    getAll: async (params = {}) => {
        const response = await api.get(ENDPOINT, { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    }, 
    store: async (data) => {
        const response = await api.post(ENDPOINT, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`${ENDPOINT}/${id}`, data);
        return response.data;
    },
    toggleStatus: async (id) => {
        const response = await api.post(`${ENDPOINT}/${id}/toggle-status`, {_method: 'PATCH'});
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`${ENDPOINT}/${id}`);
    }
}