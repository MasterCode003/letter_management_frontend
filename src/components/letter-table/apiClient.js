import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.31:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  timeout: 15000
});

apiClient.interceptors.request.use(async (config) => {
  // Try to get token from meta tag first
  let token = document.querySelector('meta[name="csrf-token"]')?.content;
  
  // If no token found, try to fetch a new one
  if (!token) {
    try {
      await apiClient.get('/sanctum/csrf-cookie');
      token = document.querySelector('meta[name="csrf-token"]')?.content;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }

  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  response => {
    // Ensure response has proper structure
    return {
      ...response,
      data: response.data || {},
      status: response.status || 200
    };
  },
  error => {
    // Create standardized error response
    const errorResponse = {
      message: 'An error occurred',
      status: 500,
      data: null
    };

    if (error.response) {
      errorResponse.message = error.response.data?.message || 'HTTP error occurred';
      errorResponse.status = error.response.status;
      errorResponse.data = error.response.data;
    } else if (error.request) {
      errorResponse.message = 'Network error - no response received';
    } else {
      errorResponse.message = error.message || 'Unknown error occurred';
    }

    console.error('API Error:', errorResponse);
    return Promise.reject(errorResponse);
  }
);

export { apiClient };