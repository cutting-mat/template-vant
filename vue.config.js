const SriPlugin = require('webpack-subresource-integrity');

module.exports = {
  transpileDependencies: [],  // 需要babel编译的依赖包名
  css: {
    sourceMap: true,      // 开启css map
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            'red': '#fe3d53',
          },
        }
      }
    }
  },
  productionSourceMap: false, // 生产环境关闭map
  configureWebpack: {
    output: {
      crossOriginLoading: 'anonymous',
    },
    plugins: [
      new SriPlugin({
        hashFuncNames: ['sha256', 'sha384'],
        enabled: process.env.NODE_ENV === 'production'  // 生产环境开启子资源完整性（SRI）配置
      })
    ],
  },
  // outputDir: 'docs',   // 构建目录，默认'dist'
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/'      // 根路径，需要配置服务器转发
}