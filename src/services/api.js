import axios from 'axios';

// Konfigurasi default axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Ubah sesuai URL API Anda
  timeout: 10000, // Timeout request (opsional)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk Request
api.interceptors.request.use(
  (config) => {
    // Misalnya, mengambil token dari localStorage atau Zustand
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
    }
    return Promise.reject(error);
  }
);

export default api;
