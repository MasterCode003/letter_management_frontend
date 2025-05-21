import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.31:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000
});

apiClient.interceptors.request.use(async config => {
  // Add /api prefix for all requests
  if (!config.url.startsWith('/api')) {
    config.url = '/api' + config.url;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your network connection.';
    }
    return Promise.reject(error);
  }
);

export default apiClient;