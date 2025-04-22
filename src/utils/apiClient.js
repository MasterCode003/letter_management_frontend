import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.71:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  withCredentials: false,
  timeout: 30000, // Increased from 15000ms to 30000ms (30 seconds)
  maxRetries: 3,
  retryDelay: 1000
});

// Improved retry mechanism
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config || {};
    config.retry = config.retry || 0;

    // Skip retry for document endpoints if we got a response
    const isDocumentEndpoint = config.url?.includes('/export') || config.url?.includes('/preview');
    if (isDocumentEndpoint && error.response) {
      return Promise.reject(error);
    }

    // Define retryable conditions
    const shouldRetry = (
      config.retry < apiClient.defaults.maxRetries && 
      (error.code === 'ERR_NETWORK' || 
       error.code === 'ECONNABORTED' ||
       (error.response && error.response.status >= 500))
    );

    if (shouldRetry) {
      config.retry += 1;
      const delay = config.retry * apiClient.defaults.retryDelay;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // For document endpoints, ensure responseType is correct
      if (isDocumentEndpoint) {
        config.responseType = 'blob';
      }
      
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

// Modify request interceptor for document endpoints
apiClient.interceptors.request.use(
  config => {
    if (config.url?.includes('/preview')) {
      config.responseType = 'blob';
      config.headers = {
        'Accept': 'text/html, application/pdf',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      };
    }
    
    console.log('Request Config:', config);
    return config;
  },
  error => Promise.reject(error)
);

// Modify response interceptor to handle both HTML and PDF
apiClient.interceptors.response.use(
  response => {
    const contentType = response.headers['content-type'];
    
    // Skip modal handling for Word conversion
    if (response.config.url?.includes('/convert-to-word')) {
      return response;
    }
    
    if (contentType?.includes('text/html')) {
      const reader = new FileReader();
      reader.onload = function() {
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(reader.result);
          win.document.close();
        }
      };
      reader.readAsText(response.data);
      return response;
    } 
    else if (contentType?.includes('application/pdf')) {
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 3000);
      return response;
    }
    
    return response;
  },
  error => Promise.reject(error)
);

// Modify request interceptor to handle both HTML and PDF
apiClient.interceptors.response.use(
  response => {
    console.log('Response Headers:', response.headers);
    console.log('Response Type:', response.data?.constructor?.name);

    if (response.config.responseType === 'document' || 
        response.headers['content-type']?.includes('text/html')) {
      // For HTML/blade template responses
      const content = response.data;
      const win = window.open('', '_blank');
      win.document.write(content);
      win.document.close();
      
      return {
        ...response,
        data: { content, type: 'html' }
      };
    } else if (response.data instanceof Blob) {
      // Handle PDF response
      const pdfUrl = window.URL.createObjectURL(response.data);
      return {
        ...response,
        data: {
          blob: response.data,
          url: pdfUrl,
          type: 'pdf'
        }
      };
    }
    return response;
  },
  async error => {
    const config = error.config || {};
    
    // Handle blob response errors
    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        error.response.data = errorJson;
      } catch (e) {
        error.response.data = { message: 'Failed to generate document' };
      }
    }
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    config.url += (config.url.includes('?') ? '&' : '?') + `_t=${timestamp}`;
    
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Remove the health-check interceptor as it might cause additional issues
apiClient.interceptors.request.use(
  config => {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    config.url += (config.url.includes('?') ? '&' : '?') + `_t=${timestamp}`;
    
    // Log the complete request URL for debugging
    console.log('Full Request URL:', `${config.baseURL}${config.url}`);
    
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use(
  config => {
    // Only validate recipients for letter-related endpoints
    if (config.method === 'put' && config.url.includes('/letters') && config.data) {
      let data = typeof config.data === 'string' ? JSON.parse(config.data) : { ...config.data };
      
      // Ensure recipients is always an array with valid objects
      if (data.recipients) {
        // Convert to array if it's not
        const recipientsArray = Array.isArray(data.recipients) ? data.recipients : [data.recipients];
        
        data.recipients = recipientsArray
          .filter(Boolean) // Remove falsy values
          .map(recipient => {
            // Handle string recipients
            if (typeof recipient === 'string') {
              const trimmedName = recipient.trim();
              return trimmedName ? { name: trimmedName, position: '' } : null;
            }
            
            // Handle object recipients
            const name = recipient?.name?.trim() || '';
            return name ? {
              name: name,
              position: (recipient?.position || '').trim()
            } : null;
          })
          .filter(Boolean); // Remove null entries
      }

      // Ensure at least one valid recipient
      if (!data.recipients?.length) {
        throw new Error('At least one recipient with a name is required');
      }

      config.data = JSON.stringify(data);
    }
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    config.url += (config.url.includes('?') ? '&' : '?') + `_t=${timestamp}`;
    
    console.log('Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    // Log successful response
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    };
    console.error('API Error Details:', errorDetails);
    return Promise.reject(error);
  }
);

// Add response interceptor to format recipient data
apiClient.interceptors.response.use(
  response => {
    // For letters endpoint
    if (response.config.url.includes('/letters')) {
      // Handle array of letters
      if (response.data?.data && Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map(letter => ({
          ...letter,
          recipients: Array.isArray(letter.recipients) 
            ? letter.recipients
            : typeof letter.recipients === 'object' 
              ? [letter.recipients]
              : []
        }));
      }
      // Handle single letter
      else if (response.data?.data) {
        const letter = response.data.data;
        response.data.data = {
          ...letter,
          recipients: Array.isArray(letter.recipients) 
            ? letter.recipients
            : typeof letter.recipients === 'object' 
              ? [letter.recipients]
              : []
        };
      }
    }
    
    // For recipients endpoint
    if (response.config.url.includes('/recipients')) {
      if (response.data?.data && Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map(recipient => ({
          id: recipient.id,
          name: recipient.name || '',
          position: recipient.position || ''
        }));
      }
    }

    console.log('Processed Response:', response.data);
    return response;
  },
  error => Promise.reject(error)
);

// Add request interceptor for recipient endpoints
apiClient.interceptors.request.use(
  config => {
    // Format recipient data for POST/PUT requests
    if ((config.method === 'post' || config.method === 'put') && 
        config.url.includes('/letters') && 
        config.data) {
      const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      
      if (data.recipients) {
        data.recipients = Array.isArray(data.recipients) 
          ? data.recipients.map(r => ({
              name: r.name || '',
              position: r.position || ''
            }))
          : [];
      }
      
      config.data = JSON.stringify(data);
    }
    return config;
  },
  error => Promise.reject(error)
);

// Modify request interceptor for document endpoints
apiClient.interceptors.request.use(
  config => {
    if (config.url?.includes('/convert-to-word')) {
      config.headers = {
        ...config.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add specific handler for conversion responses
apiClient.interceptors.response.use(
  response => {
    if (response.config.url?.includes('/convert-to-word')) {
      if (response.data?.file_url) {
        return {
          ...response,
          data: {
            success: true,
            file_url: response.data.file_url
          }
        };
      }
    }
    return response;
  },
  error => Promise.reject(error)
);

export default apiClient;