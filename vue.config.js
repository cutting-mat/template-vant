var TransformModulesPlugin = require('webpack-transform-modules-plugin')

module.exports = {
    configureWebpack: {
		resolve: {
			alias: {
				'cube-ui': 'cube-ui/lib'
			}
		},
		plugins: [
			new TransformModulesPlugin()
		]
	},

    productionSourceMap: false,

    css: {
      loaderOptions: {
        stylus: {
          'resolve url': true,
          'import': []
        }
      }
    },

    pluginOptions: {
      'cube-ui': {
        postCompile: false,
        theme: false
      }
    }
}
