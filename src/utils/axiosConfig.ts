// services/axiosConfig.ts
import axios from 'axios';

const instance = axios.create({
  //baseURL: 'http://40.76.114.46:8000', // asegúrate que es el correcto
  baseURL: 'https://senatalk.eastus.cloudapp.azure.com'
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
