// vite.config.js
import { defineConfig } from "file:///C:/Users/macze/OneDrive/Documents/GitHub/letter_management_frontend/my-letter-system/node_modules/vite/dist/node/index.js";
import vue2 from "file:///C:/Users/macze/OneDrive/Documents/GitHub/letter_management_frontend/node_modules/@vitejs/plugin-vue2/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [vue2()],
  server: {
    host: "192.168.5.15",
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://192.168.5.15:8000",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtYWN6ZVxcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXGxldHRlcl9tYW5hZ2VtZW50X2Zyb250ZW5kXFxcXG15LWxldHRlci1zeXN0ZW1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG1hY3plXFxcXE9uZURyaXZlXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcbGV0dGVyX21hbmFnZW1lbnRfZnJvbnRlbmRcXFxcbXktbGV0dGVyLXN5c3RlbVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbWFjemUvT25lRHJpdmUvRG9jdW1lbnRzL0dpdEh1Yi9sZXR0ZXJfbWFuYWdlbWVudF9mcm9udGVuZC9teS1sZXR0ZXItc3lzdGVtL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZTIgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlMidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3Z1ZTIoKV0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiAnMTkyLjE2OC41LjE1JyxcclxuICAgIHBvcnQ6IDUxNzMsXHJcbiAgICBvcGVuOiB0cnVlLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9hcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguNS4xNTo4MDAwJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICB0aW1lb3V0OiAzMDAwMCxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aCwgIC8vIERvbid0IHJlbW92ZSB0aGUgL2FwaSBwcmVmaXhcclxuICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcclxuICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIF9yZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Byb3h5IGVycm9yJywgZXJyKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlcXVlc3QgVVJMOicsIHJlcS51cmwpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVxdWVzdCBNZXRob2Q6JywgcmVxLm1ldGhvZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXF1ZXN0IEJvZHk6JywgcmVxLmJvZHkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAocHJveHlSZXMuc3RhdHVzQ29kZSA9PT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJzQwNCBOb3QgRm91bmQ6Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiByZXEudXJsLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXEubWV0aG9kLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyBEaXNhYmxlIFdlYlNvY2tldCBjb25uZWN0aW9uIHN0YXR1cyBtZXNzYWdlc1xyXG4gIGhtcjoge1xyXG4gICAgb3ZlcmxheTogZmFsc2VcclxuICB9LFxyXG4gIGxvZ0xldmVsOiAnZXJyb3InXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOGIsU0FBUyxvQkFBb0I7QUFDM2QsT0FBTyxVQUFVO0FBRWpCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFBQSxFQUNoQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixTQUFTO0FBQUEsUUFDVCxTQUFTLENBQUMsU0FBUztBQUFBO0FBQUEsUUFDbkIsV0FBVyxDQUFDLE9BQU8sYUFBYTtBQUM5QixnQkFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLE1BQU0sU0FBUztBQUNyQyxvQkFBUSxJQUFJLGVBQWUsR0FBRztBQUFBLFVBQ2hDLENBQUM7QUFDRCxnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssU0FBUztBQUM1QyxvQkFBUSxJQUFJLGdCQUFnQixJQUFJLEdBQUc7QUFDbkMsb0JBQVEsSUFBSSxtQkFBbUIsSUFBSSxNQUFNO0FBQ3pDLG9CQUFRLElBQUksaUJBQWlCLElBQUksSUFBSTtBQUFBLFVBQ3ZDLENBQUM7QUFDRCxnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssU0FBUztBQUM1QyxnQkFBSSxTQUFTLGVBQWUsS0FBSztBQUMvQixzQkFBUSxJQUFJLGtCQUFrQjtBQUFBLGdCQUM1QixLQUFLLElBQUk7QUFBQSxnQkFDVCxRQUFRLElBQUk7QUFBQSxnQkFDWixTQUFTLElBQUk7QUFBQSxjQUNmLENBQUM7QUFBQSxZQUNIO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsRUFDWDtBQUFBLEVBQ0EsVUFBVTtBQUNaLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
