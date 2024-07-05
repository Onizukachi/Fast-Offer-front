import axios from 'axios';
import {API_BACK_BASE_URL} from "@constants/api.js";

const api = axios.create({
  baseURL: API_BACK_BASE_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api