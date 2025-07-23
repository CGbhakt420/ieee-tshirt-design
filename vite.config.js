import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://threed-tshirt-design-kv3l.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

// vite.config.js
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         // Change this to your local backend's URL
//         target: "http://localhost:5000", 
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },
// });
