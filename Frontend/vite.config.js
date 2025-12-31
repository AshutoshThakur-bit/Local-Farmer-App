// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';         // ✅ Add this import
import tailwindcss from '@tailwindcss/vite';     // ✅ Tailwind plugin

export default defineConfig({
  plugins: [
    react(),        // ✅ React plugin
    tailwindcss(),  // ✅ Tailwind plugin
  ],
 server: {
  proxy: {
    '/api': 'http://localhost:5001',
  },
}
});
