const path = require('path')

module.exports = {
	entry: {
		bundle: "./src/index.tsx",
	},
	mode: "development",
	output: {
		filename: "[name].js",
		globalObject: 'this',
		library: "DocereSearch",
		libraryTarget: "umd",
		// path: __dirname + "/dist",
		path: path.resolve(__dirname, '../search/dist'),
		// publicPath: "/dist/"
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
		react: {
			commonjs: "react",
			commonjs2: "react",
			amd: "React",
			root: "React"
		},
		'styled-components': {
			commonjs: "styled-components",
			commonjs2: "styled-components",
			amd: "styled",
			root: "styled"
		}
	}
};
