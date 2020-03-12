const path = require('path')

module.exports = {
	devServer: {
		contentBase: path.resolve(__dirname),
		disableHostCheck: true,
		headers: { "Access-Control-Allow-Origin": "*" },
		historyApiFallback: {
			disableDotRule: true
		},
		port: 4000,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				pathRewrite: {'^/api': ''}
			},
			'/search': {
				target: 'http://localhost:9200',
				pathRewrite: {'^/search': ''}
			},
			'/iiif': {
				changeOrigin: true,
				target: 'http://localhost:5004',
				pathRewrite: {'^/iiif': ''}
			}
		},
		watchOptions: {
			ignored: /node_modules/
		}
	},
	entry: ['./src/index.tsx'],
	output: {
			filename: 'bundle.js',
			chunkFilename: '[name].bundle.js',
			path: __dirname + '/build-dev-server',
			publicPath: '/build-dev-server/',
	},
	mode: 'development',
	module: {
		rules: [
				{
					exclude: /node_modules/,
					test: /\.tsx?$/,
					loader: "ts-loader",
					options: {
						// configFile: 'tsconfig.dev.json',
						transpileOnly: true
					}
				}
		]
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		// alias: {
		// 	'@docere/search': path.resolve(__dirname, '../search'),
		// 	'@docere/projects': path.resolve(__dirname, '../projects'),
		// 	'@docere/text': path.resolve(__dirname, '../text'),
		// 	'@docere/frontend': path.resolve(__dirname, '../frontend/src/export'),
		// }
		// plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.dev.json' })]
	}
};
