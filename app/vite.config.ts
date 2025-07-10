import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    chunkSizeWarningLimit: 50000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    exclude: ["aframe"] // Don't try to optimize it, Vite. Just... don't.
  },
  server: {
    port: 5174,
    host: "0.0.0.0",
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "cert/192.168.100.9-key.pem")
      ),
      cert: fs.readFileSync(path.resolve(__dirname, "cert/192.168.100.9.pem"))
    },
    proxy: {
      "/api": {
        target: "http://192.168.100.9:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // strip /api prefix if needed
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log(`[VITE PROXY] ${req.method} ${req.url}`);
          });
        }
      }
    }
  }
});
