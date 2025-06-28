// services/axiosConfig.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // asegúrate que es el correcto
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
