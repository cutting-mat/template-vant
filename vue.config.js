module.exports = {
    transpileDependencies: [],       // 需要编译的依赖包名
    productionSourceMap: false,
    css: {
        sourceMap: true,
        loaderOptions: {
            less: {
              modifyVars: {
                'goods-action-button-danger-color': '#7232dd',
                'goods-action-button-warning-color': '#3eaf7c'
              }
            }
          }
    },
    outputDir: 'dist',
    publicPath: process.env.NODE_ENV === 'production'
      ? '/'
      : '/'
}