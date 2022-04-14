import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
  },
  plugins: [
    vue(),
    createStyleImportPlugin({
      resolves: [VantResolve()],
    }),
  ]
})
