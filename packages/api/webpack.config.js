const path = require('path')

module.exports = {
	entry: {
		utils: "./src/puppenv/utils.ts",
		projects: "../projects/src/index.ts"
	},
	mode: "development",
	output: {
		filename: "[name].js",
		globalObject: 'this',
		library: ["PuppenvData", "[name]"],
		libraryTarget: "umd",
		path: path.resolve(__dirname, './build.puppenv.data'),
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
