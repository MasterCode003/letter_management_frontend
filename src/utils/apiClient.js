import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.94:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 30000
});

// Simplified request interceptor
apiClient.interceptors.request.use(
  async config => {
    try {
      // Get CSRF token for non-GET requests
      if (!['get', 'head', 'options'].includes(config.method?.toLowerCase())) {
        await axios.get('http://192.168.5.94:8000/sanctum/csrf-cookie', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        // Add CSRF token to request headers if available
        const token = document.cookie.match(/XSRF-TOKEN=(.*?)(;|$)/);
        if (token?.[1]) {
          config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token[1]);
        }
      }
      return config;
    } catch (error) {
      console.warn('CSRF token fetch failed:', error);
      return config;
    }
  },
  error => Promise.reject(error)
);

// Simplified response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error') {
      console.error('Network Error - Please check backend connection and CORS settings');
    }
    return Promise.reject(error);
  }
);

export default apiClient;