import { apiClient } from './client';
import { CreateUser, Login } from '@vidflow/shared';

export const authApi = {
  register: async (data: CreateUser) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: Login) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
