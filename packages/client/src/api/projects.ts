import { apiClient } from './client';
import { CreateProject, UpdateProject } from '@vidflow/shared';

export const projectsApi = {
  getAll: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProject) => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProject) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};
