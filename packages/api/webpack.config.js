const path = require('path')

module.exports = {
	entry: {
		bundle: "./node_modules/@docere/common/src/puppenv.utils.ts"
	},
	mode: "development",
	output: {
		filename: "[name].js",
		globalObject: 'this',
		library: "PuppenvUtils",
		libraryTarget: "umd",
		path: path.resolve(__dirname, './build.puppenv.utils'),
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "ts-loader",
			}
		]
	}
}
