import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createStyleImportPlugin({
      resolves: [VantResolve()],
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
  },
  base: process.env.NODE_ENV === 'production'           // 生产/开发环境构建路径, 默认'/template-element-ui/'
    ? '/template-vant4/'
    : '/',
  build: {
    outDir: 'dist'
  }
})
