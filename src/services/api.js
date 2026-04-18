import axios from 'axios';
import useAppStore from '../store/useAppStore';

// Konfigurasi default axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // Ubah sesuai URL API Anda
  timeout: 10000, // Timeout request (opsional)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk Request
api.interceptors.request.use(
  (config) => {
    // Mengambil token dari Zustand
    const { accessToken } = useAppStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk Response
api.interceptors.response.use(
  (response) => {
    // Memproses response sukses
    return response.data;
  },
  (error) => {
    // Memproses log atau handle error (misalnya redirect kalau 401 Unauthorized)
    if (error.response?.status === 401) {
       // logic redirect ke login
       useAppStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
