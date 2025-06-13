import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'https://jobportalbackend-production-8f6a.up.railway.app/api/v1',
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
