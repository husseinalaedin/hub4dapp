import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactRouter } from "@react-router/dev/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRouter()],
  // build: {
  //   target: "esnext",
  //   minify: "terser",
  //   cssCodeSplit: true,
  // },
  // optimizeDeps: {
  //   include:[]//["react", "react-dom"], // Pre-bundle frequently used dependencies
  // },
   
});
