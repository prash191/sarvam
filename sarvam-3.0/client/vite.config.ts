import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        name: 'SarvamWidget',
        fileName: 'widget',
        formats: ['iife']
      },
      rollupOptions: {
        output: {
          // Ensure all code is bundled into a single file
          inlineDynamicImports: true,
          // Use a simple filename without hash
          entryFileNames: 'widget.js',
          chunkFileNames: 'widget.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'widget.css'
            }
            return '[name].[ext]'
          }
        }
      },
      // Minify for production
      minify: mode === 'production',
      sourcemap: mode === 'development'
    },
    define: {
      // Replace process.env.NODE_ENV since we're building for browser
      'process.env.NODE_ENV': JSON.stringify(mode),
      // Make sure Vite environment variables are available
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:3001/api')
    }
  }
})
