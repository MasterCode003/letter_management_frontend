import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.94:8000/api',  // Update to your current IP
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Update CSRF token request
apiClient.interceptors.request.use(
  async config => {
    try {
      if (config.method !== 'get' && !document.cookie.includes('XSRF-TOKEN')) {
        await axios.get('http://192.168.5.93:8000/sanctum/csrf-cookie', {  // Update to your current IP
          withCredentials: true,
          timeout: 10000,  // Increased timeout for CSRF request
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
      }
    } catch (error) {
      console.error('CSRF token fetch failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor remains the same
apiClient.interceptors.response.use(
  response => response,
  async error => {
    console.error('API Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      message: error.message
    });
    
    const config = error.config;
    
    // Handle unauthorized (401) responses
    if (error.response?.status === 401) {
        window.location.href = '/login';  // Redirect to login
        return Promise.reject({ success: false, message: 'Authentication required' });
    }
    
    // Retry logic with improved condition
    if ((error.code === 'ECONNABORTED' || error.response?.status >= 500) && (config.retryCount || 0) < 3) {
        config.retryCount = (config.retryCount || 0) + 1;
        return new Promise(resolve => setTimeout(() => resolve(apiClient(config)), 1000));
    }

    return Promise.reject({
        success: error.response?.data?.success || false,
        message: error.response?.data?.message || 
               (error.response?.status ? `HTTP Error ${error.response.status}` : 'Network Error'),
        errors: error.response?.data?.errors,
        status: error.response?.status
    });
  }
);

// Add letters API methods
export const lettersApi = {
  getAll: () => apiClient.get('/letters'),
  getById: (id) => apiClient.get(`/letters/${id}`),
  create: (data) => apiClient.post('/letters', data),
  update: (id, data) => apiClient.put(`/letters/${id}`, data),
  delete: (id) => apiClient.delete(`/letters/${id}`)
};

export default apiClient;