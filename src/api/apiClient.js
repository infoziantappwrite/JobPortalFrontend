import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'https://jobportalbackend-production-87e4.up.railway.app/api',
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('at'); // using 'at' instead of 'token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
