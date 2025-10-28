import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


// no React plugin needed unless your content uses JSX/React
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'window',
  },
  base: "",
  build: {
    outDir: "dist",
    emptyOutDir: false,           
    lib: {
      entry: "src/Content/Watcher.jsx",
      formats: ["iife"], 
      name: "ContentScript",
      fileName: () => "Watcher.js", 
    },
    rollupOptions: {
      input: 'src/Content/Watcher.js',
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
