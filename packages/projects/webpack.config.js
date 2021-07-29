const path = require('path')
const webpack = require('webpack')
// Read the .env file
const { parsed: env, error: envError } = require('dotenv').config({ path: path.resolve(process.cwd(), `../../.env`) })
if (envError) throw envError

module.exports = {
	entry: {
		republic: './src/index.ts'
	},
	output: {
		// chunkFilename: '[chunkhash].chunk.js?cacheBust=[chunkhash]',
		clean: true,
		filename: 'projects.js',
		library: 'DocereProjects',
		libraryTarget: 'umd',
		path: __dirname + '/build2',
	},
	mode: 'development',
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true
				}
			},
		]
	},
	plugins: [new webpack.DefinePlugin(
		Object.keys(env).reduce((prev, curr) => {
			prev[curr] = JSON.stringify(env[curr])
			return prev
		}, {})
	)],
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
	},
}
