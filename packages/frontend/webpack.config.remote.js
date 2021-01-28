const devConfig = require('./webpack.config.local')
const path = require('path')

module.exports = () => {
	const config = devConfig()

	delete config.devServer

	config.externals = {
		react: 'React',
		'react-dom': 'ReactDOM'
	}

	config.mode = "production"

	config.module.rules[0].options = {
		configFile: 'tsconfig.dist.json'
	}

	config.output.path = path.resolve(process.cwd(), '../../public')

	return config
}
