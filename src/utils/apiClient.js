import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.68:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

apiClient.interceptors.response.use(
  response => response,
  error => {
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