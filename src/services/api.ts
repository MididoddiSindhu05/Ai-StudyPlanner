import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Also include user-id for simplicity in this demo environment
    const user = useAuthStore.getState().user;
    if (user) config.headers['x-user-id'] = user.id;
  }
  return config;
});

export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
};

export const taskService = {
  getAll: () => api.get('/tasks'),
  create: (data: any) => api.post('/tasks', data),
};

export default api;
