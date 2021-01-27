const HtmlWebpackPlugin = require('html-webpack-plugin')
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
	// config.output.publicPath = '/'

	config.plugins.push(new HtmlWebpackPlugin({
		title: 'Docere',
		template: 'index.template.html',
	}))

	return config
}
