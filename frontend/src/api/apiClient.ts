import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// En dev: Vite proxea /api → http://backend:8080
// En prod: nginx proxea /api → http://backend:8080
const rawUrl = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/+$/, '');
const API_BASE_URL = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl}/api/v1`;


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending HttpOnly cookies
});

// Request interceptor to add the access token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on auth endpoints (login/register/refresh)
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    // If error is 401 and we haven't retried yet and not already an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token using the HttpOnly cookie
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken, email } = response.data;
        
        // Update the store with new token
        useAuthStore.getState().setAuth({ email }, accessToken);

        // Update the original request header and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
