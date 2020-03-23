const webpackConfig = require('./webpack.config')

module.exports = () => {
	webpackConfig.mode = "production"
	webpackConfig.output.filename =  "[name].min.js"
	return webpackConfig
}