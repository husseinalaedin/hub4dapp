import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactRouter } from "@react-router/dev/vite";
 
export default defineConfig({
  base:'/app/',
  plugins: [
    reactRouter(),
    
  ],
  
  // build: {
  //   sourcemap: true,
  //   outDir:"dist",
  //   emptyOutDir: true,
  //   manifest: true,
  //   rollupOptions: {
  //     input: "index.html", // Change entry point if needed
  //   },
  // },
  optimizeDeps: {
    include: ['react-textarea-autosize'],
  },
  
});
