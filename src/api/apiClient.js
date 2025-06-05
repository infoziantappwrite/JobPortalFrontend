import axios from 'axios';
import { getToken } from './tokenService';

const apiClient = axios.create({
  baseURL: 'https://jobportalbackend-production-87e4.up.railway.app/api', // Your backend URL here
  withCredentials: true, // to allow cookies to be sent
});

// Automatically attach token to requests
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;