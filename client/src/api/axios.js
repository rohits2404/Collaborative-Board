import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
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

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/me'),
    getUsers: () => api.get('/auth/users'),
};

// Tasks API
export const tasksAPI = {
    getTasks: () => api.get('/tasks'),
    createTask: (taskData) => api.post('/tasks', taskData),
    updateTask: (taskId, updates) => api.put(`/tasks/${taskId}`, updates),
    deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
    smartAssign: (taskId) => api.post(`/tasks/${taskId}/smart-assign`),
};

// Actions API
export const actionsAPI = {
    getActions: () => api.get('/actions'),
    getTaskActions: (taskId) => api.get(`/actions/task/${taskId}`),
};

export default api;