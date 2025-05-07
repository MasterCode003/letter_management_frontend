import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.34:8000/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor for retry logic and CSRF token
apiClient.interceptors.request.use(
  async config => {
    // Get CSRF token before making request
    if (!document.cookie.includes('XSRF-TOKEN')) {
      await axios.get('http://192.168.5.34:8000/sanctum/csrf-cookie');
    }
    
    // Remove cache-control header
    if (config.headers) {
      delete config.headers['cache-control'];
    }
    config.retryCount = config.retryCount || 0;
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Retry up to 3 times on timeout or network errors
    if ((error.code === 'ECONNABORTED' || !error.response) && config.retryCount < 3) {
      config.retryCount += 1;
      return new Promise(resolve => setTimeout(() => resolve(apiClient(config)), 1000));
    }

    if (!error.response) {
      error.response = {
        status: 0,
        data: {
          message: 'Network Error - Unable to connect to server'
        }
      };
    }
    return Promise.reject(error);
  }
);

export default apiClient;