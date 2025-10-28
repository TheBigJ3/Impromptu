import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: { options: "index.html" },
      output: {
        entryFileNames: (chunk) => {
          return chunk.name.includes("content") ? "Watcher.js" : "assets/[name].js";
        },
      },
    },
  }
})
