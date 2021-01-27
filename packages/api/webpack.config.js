const path = require('path')
const { optimize } = require('webpack')

const config = require('../frontend/webpack.config.base')

module.exports = () => {
	config.entry = {
		utils: "./src/puppenv/utils.ts",
		projects: "../projects/src/index.ts"
	}

	config.mode = 'development'

	config.module.rules[0].options.transpileOnly = false

	config.output = {
		filename: "[name].js",
		globalObject: 'this',
		library: ["PuppenvData", "[name]"],
		libraryTarget: "umd",
		path: path.resolve(__dirname, './build.puppenv.data'),
	}
	
	config.plugins.push(new optimize.LimitChunkCountPlugin({ maxChunks: 1 }))

	return config
}
