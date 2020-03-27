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
			'/iiif/encyclopaedia-britannica': {
				changeOrigin: true,
				target: 'https://view.nls.uk/iiif',
				pathRewrite: {'^/iiif/encyclopaedia-britannica': ''}
			},
			'/iiif': {
				changeOrigin: true,
				target: 'http://localhost:5004',
				pathRewrite: {'^/iiif': ''}
			},
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
	}
};
