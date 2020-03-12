const webpackConfig = require('./webpack.config')

module.exports = () => {
	webpackConfig.devServer = {}
	// webpackConfig.mode = "production"
	webpackConfig.output.path = __dirname + '/dist'
	webpackConfig.output.publicPath = '/dist/'
	webpackConfig.module.rules[0].options = { configFile: 'tsconfig.dist.json' }
	webpackConfig.externals = {
		react: 'React',
		'react-dom': 'ReactDOM'
	}
	return webpackConfig
}
// module.exports = {
// 	entry: ['./src/index.tsx', './src/export/index.ts'],
// 	output: {
// 			filename: 'bundle.js',
// 			chunkFilename: '[name].bundle.js',
// 			path: __dirname + '/dist',
// 			publicPath: '/dist/',
// 	},
// 	mode: 'production',
// 	module: {
// 		rules: [
// 				{
// 					test: /\.tsx?$/,
// 					loader: "ts-loader",

// 				}
// 		]
// 	},
// 	optimization: {
// 		splitChunks: {
// 			chunks: 'all'
// 		}
// 	},
// 	resolve: {
// 		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
// 	}
// };
