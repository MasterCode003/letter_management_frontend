import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue2()],
  server: {
    host: true, // Change this line
    port: 5173,
    open: true, // Add this line
    proxy: {
      '/api': {
        target: 'http://192.168.5.95:8000',
        changeOrigin: true,
        secure: false,
        timeout: 30000,
        rewrite: (path) => path,  // Don't remove the /api prefix
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Request URL:', req.url);
            console.log('Request Method:', req.method);
            console.log('Request Body:', req.body);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            if (proxyRes.statusCode === 404) {
              console.log('404 Not Found:', {
                url: req.url,
                method: req.method,
                headers: req.headers
              });
            }
          });
        }
      }
    }
  },
  // Disable WebSocket connection status messages
  hmr: {
    overlay: false
  },
  logLevel: 'error'
})
