const devConfig = require('./webpack.config.development')

module.exports = () => {
	const config = devConfig()

	config.devServer = {}

	config.mode = "production"

	config.output.path = __dirname + '/dist'

	config.output.publicPath = '/dist/'

	config.module.rules[0].options = {
		configFile: 'tsconfig.dist.json'
	}

	config.externals = {
		react: 'React',
		'react-dom': 'ReactDOM'
	}

	return config
}
