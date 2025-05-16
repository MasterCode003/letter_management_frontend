import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.94:8000/api', // Updated IP address
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor to handle CSRF token
apiClient.interceptors.request.use(async config => {
  try {
    if (config.method !== 'get') {
      // FIX: Remove '/api' from the CSRF cookie URL
      await axios.get('http://192.168.5.94:8000/sanctum/csrf-cookie', { withCredentials: true });
    }
    return config;
  } catch (error) {
    console.error('CSRF token fetch failed:', error);
    return config;
  }
});

export default apiClient;