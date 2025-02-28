import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactRouter } from "@react-router/dev/vite";
import Inspect from 'vite-plugin-inspect';
import compression from "vite-plugin-compression";

export default defineConfig({
  base:'/app/',
  plugins: [
    reactRouter(),
    Inspect(),
    compression({
      algorithm: "gzip",
      ext: ".gz", // Generates .gz files
      threshold: 1024, // Only compress files larger than 1KB
      deleteOriginFile: false, // Keep original files
    }),
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
