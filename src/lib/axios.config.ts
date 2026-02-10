import axios from "axios";
const BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token endpoint
        await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true } // Cookie yuboriladi
        );

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token ham expired - logout
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient ;
