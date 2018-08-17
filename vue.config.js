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
	}
}