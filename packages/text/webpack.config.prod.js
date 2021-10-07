const webpackConfig = require('./webpack.config')
const path = require('path')

module.exports = () => {
	webpackConfig.mode = "production"
	webpackConfig.output.filename =  "[name].min.js"
	webpackConfig.output.path = path.resolve(__dirname, './dist')
	return webpackConfig
}
