const path = require('path')

module.exports = {
	entry: {
		bundle: "./src/index.tsx",
	},
	mode: "development",
	output: {
		filename: "[name].js",
		globalObject: 'this',
		library: "DocereText",
		libraryTarget: "umd",
		// path: __dirname + "/dist",
		path: path.resolve(__dirname, '../text/dist')
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
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM'
	}
};
