import axios from 'axios';
import { store } from '../store/store';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор запросов для добавления токена аутентификации
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор ответов для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Обработка неавторизованного доступа
      store.dispatch({ type: 'auth/logout' });
    }
    return Promise.reject(error);
  }
);

// API аутентификации
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  vkAuth: (vkData) => api.post('/auth/vk-auth', vkData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// API сообществ
export const communitiesAPI = {
  getCommunities: (filters = {}) => api.get('/communities', { params: filters }),
  getCommunity: (id) => api.get(`/communities/${id}`),
  createCommunity: (communityData) => api.post('/communities', communityData),
  joinCommunity: (id) => api.post(`/communities/${id}/join`),
  leaveCommunity: (id) => api.post(`/communities/${id}/leave`),
  getCommunityMembers: (id, filters = {}) => 
    api.get(`/communities/${id}/members`, { params: filters }),
};

// API проектов
export const projectsAPI = {
  getProjects: (filters = {}) => api.get('/projects', { params: filters }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  applyToProject: (id, applicationData) => 
    api.post(`/projects/${id}/apply`, applicationData),
  updateApplicationStatus: (applicationId, status) =>
    api.put(`/projects/applications/${applicationId}/status`, { status }),
};

// API мероприятий
export const eventsAPI = {
  getEvents: (filters = {}) => api.get('/events', { params: filters }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  registerForEvent: (id) => api.post(`/events/${id}/register`),
};

// API чата
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId, page = 1) => 
    api.get(`/chat/conversations/${conversationId}/messages`, { 
      params: { page, limit: 50 } 
    }),
  sendMessage: (messageData) => api.post('/chat/send', messageData),
};

// API пользователей
export const usersAPI = {
  searchUsers: (filters = {}) => api.get('/users/search', { params: filters }),
  getUserProfile: (userId) => api.get(`/users/${userId}/profile`),
  updateSkills: (skills) => api.put('/users/skills', { skills }),
  getUserStats: (userId) => api.get(`/users/${userId}/stats`),
};

export default api;
