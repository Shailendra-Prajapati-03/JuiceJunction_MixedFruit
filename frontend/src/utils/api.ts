import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      const isVendorPath = window.location.pathname.startsWith('/vendor');
      window.location.href = isVendorPath ? '/vendor/login' : '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
