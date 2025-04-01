// vite.config.js
import { defineConfig } from "file:///C:/Users/KentBrian%20D%20Galleros/Desktop/letter_management_frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/KentBrian%20D%20Galleros/Desktop/letter_management_frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [vue()],
  // Changed from vue2()
  server: {
    host: true,
    // This allows access from network
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://192.168.8.36:8000",
        changeOrigin: true,
        secure: false,
        timeout: 3e4,
        rewrite: (path) => path,
        // Don't remove the /api prefix
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Request URL:", req.url);
            console.log("Request Method:", req.method);
            console.log("Request Body:", req.body);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            if (proxyRes.statusCode === 404) {
              console.log("404 Not Found:", {
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
  logLevel: "error"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLZW50QnJpYW4gRCBHYWxsZXJvc1xcXFxEZXNrdG9wXFxcXGxldHRlcl9tYW5hZ2VtZW50X2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLZW50QnJpYW4gRCBHYWxsZXJvc1xcXFxEZXNrdG9wXFxcXGxldHRlcl9tYW5hZ2VtZW50X2Zyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9LZW50QnJpYW4lMjBEJTIwR2FsbGVyb3MvRGVza3RvcC9sZXR0ZXJfbWFuYWdlbWVudF9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJyAgLy8gQ2hhbmdlZCBmcm9tIHBsdWdpbi12dWUyXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFt2dWUoKV0sICAvLyBDaGFuZ2VkIGZyb20gdnVlMigpXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiB0cnVlLCAgLy8gVGhpcyBhbGxvd3MgYWNjZXNzIGZyb20gbmV0d29ya1xyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIG9wZW46IHRydWUsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC44LjM2OjgwMDAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIHRpbWVvdXQ6IDMwMDAwLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLCAgLy8gRG9uJ3QgcmVtb3ZlIHRoZSAvYXBpIHByZWZpeFxyXG4gICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBfb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncHJveHkgZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVxdWVzdCBVUkw6JywgcmVxLnVybCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0IE1ldGhvZDonLCByZXEubWV0aG9kKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlcXVlc3QgQm9keTonLCByZXEuYm9keSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwcm94eVJlcy5zdGF0dXNDb2RlID09PSA0MDQpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnNDA0IE5vdCBGb3VuZDonLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHJlcS51cmwsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHJlcS5tZXRob2QsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiByZXEuaGVhZGVyc1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8vIERpc2FibGUgV2ViU29ja2V0IGNvbm5lY3Rpb24gc3RhdHVzIG1lc3NhZ2VzXHJcbiAgaG1yOiB7XHJcbiAgICBvdmVybGF5OiBmYWxzZVxyXG4gIH0sXHJcbiAgbG9nTGV2ZWw6ICdlcnJvcidcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnWSxTQUFTLG9CQUFvQjtBQUM3WixPQUFPLFNBQVM7QUFFaEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBO0FBQUEsRUFDZixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVM7QUFBQSxRQUNULFNBQVMsQ0FBQyxTQUFTO0FBQUE7QUFBQSxRQUNuQixXQUFXLENBQUMsT0FBTyxhQUFhO0FBQzlCLGdCQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssTUFBTSxTQUFTO0FBQ3JDLG9CQUFRLElBQUksZUFBZSxHQUFHO0FBQUEsVUFDaEMsQ0FBQztBQUNELGdCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTO0FBQzVDLG9CQUFRLElBQUksZ0JBQWdCLElBQUksR0FBRztBQUNuQyxvQkFBUSxJQUFJLG1CQUFtQixJQUFJLE1BQU07QUFDekMsb0JBQVEsSUFBSSxpQkFBaUIsSUFBSSxJQUFJO0FBQUEsVUFDdkMsQ0FBQztBQUNELGdCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTO0FBQzVDLGdCQUFJLFNBQVMsZUFBZSxLQUFLO0FBQy9CLHNCQUFRLElBQUksa0JBQWtCO0FBQUEsZ0JBQzVCLEtBQUssSUFBSTtBQUFBLGdCQUNULFFBQVEsSUFBSTtBQUFBLGdCQUNaLFNBQVMsSUFBSTtBQUFBLGNBQ2YsQ0FBQztBQUFBLFlBQ0g7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxFQUNYO0FBQUEsRUFDQSxVQUFVO0FBQ1osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
