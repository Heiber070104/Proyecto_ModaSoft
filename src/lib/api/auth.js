import api from './api.js';

const ENDPOINT = '/auth';

export const authApi = {
    login: async (email, password) => {
        const credentials = { email, password };
        const response = await api.post(`${ENDPOINT}/login`, credentials);
        return response.data;
    },
    logout: async () => {
        await api.post(`${ENDPOINT}/logout`);
    },
    me: async () => {
        const response = await api.post(`${ENDPOINT}/me`);
        return response.data;
    }
}