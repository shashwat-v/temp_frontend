import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we have refresh token, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('token', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Issues API
export const issuesAPI = {
  getIssues: (params) => api.get('/issues', { params }),
  getIssue: (id) => api.get(`/issues/${id}`),
  createIssue: (data) => {
    // If data is FormData (for file upload), let axios set Content-Type automatically
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.post('/issues', data, config);
  },
  upvoteIssue: (id) => api.post(`/issues/${id}/upvote`),
  removeUpvote: (id) => api.delete(`/issues/${id}/upvote`),
  addComment: (id, content) => api.post(`/issues/${id}/comments`, { content }),
  subscribe: (id) => api.post(`/issues/${id}/subscribe`),
  unsubscribe: (id) => api.delete(`/issues/${id}/subscribe`),
};

// User API
export const userAPI = {
  getMyIssues: () => api.get('/users/me/issues'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  updateNotificationPreferences: (preferences) => api.put('/users/me/preferences', preferences),
  deleteAccount: () => api.delete('/users/me'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  updateIssueStatus: (id, status, notes) =>
    api.put(`/admin/issues/${id}/status`, { status, notes }),
  verifyIssue: (id) => api.put(`/admin/issues/${id}/verify`),
  deleteIssue: (id) => api.delete(`/admin/issues/${id}`),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  getGeographic: (params) => api.get('/analytics/geographic', { params }),
  getTrends: (params) => api.get('/analytics/trends', { params }),
  getInsights: () => api.get('/analytics/insights'),
};

// Forum API
export const forumAPI = {
  // Categories
  getCategories: () => api.get('/forum/categories'),
  getThreadsByCategory: (categoryId, params) => api.get(`/forum/categories/${categoryId}/threads`, { params }),

  // Threads
  getThread: (threadId) => api.get(`/forum/threads/${threadId}`),
  createThread: (data) => api.post('/forum/threads', data),
  subscribeToThread: (threadId) => api.post(`/forum/threads/${threadId}/subscribe`),
  unsubscribeFromThread: (threadId) => api.delete(`/forum/threads/${threadId}/subscribe`),

  // Posts
  replyToThread: (threadId, content) => api.post(`/forum/threads/${threadId}/posts`, { content }),
  upvotePost: (postId) => api.post(`/forum/posts/${postId}/upvote`),
  removeUpvoteFromPost: (postId) => api.delete(`/forum/posts/${postId}/upvote`),
};

export default api;