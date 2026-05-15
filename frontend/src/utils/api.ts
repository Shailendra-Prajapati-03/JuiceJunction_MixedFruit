import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
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
      // Check if we're already on an auth-related page to prevent redirect loops
      const isAuthPage = window.location.pathname === '/auth' || window.location.pathname === '/vendor/login';
      
      if (!isAuthPage) {
        // Clear token from simple localStorage
        localStorage.removeItem('token');
        
        // Also clear token from the persisted Zustand store to prevent it from re-hydrating
        const storageKey = 'juicejunction-storage';
        const storage = localStorage.getItem(storageKey);
        if (storage) {
          try {
            const data = JSON.parse(storage);
            if (data.state) {
              data.state.token = null;
              data.state.isAuthenticated = false;
              data.state.user = null;
              localStorage.setItem(storageKey, JSON.stringify(data));
            }
          } catch (e) {
            console.error('Failed to clear persisted auth state', e);
          }
        }

        const isVendorPath = window.location.pathname.startsWith('/vendor');
        window.location.href = isVendorPath ? '/vendor/login' : '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
