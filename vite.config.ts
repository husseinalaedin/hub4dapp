import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactRouter } from "@react-router/dev/vite";
 
export default defineConfig({
  plugins: [
    reactRouter(),
    
  ],
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['react-textarea-autosize'],
  },
  
});
