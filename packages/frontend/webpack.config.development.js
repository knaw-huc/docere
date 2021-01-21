const path = require('path')
const baseConfig = require('./webpack.config.base')

module.exports = () => {
	baseConfig.devServer = {
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
				// pathRewrite: {'^/api': ''}
			},
			'/search': {
				target: 'http://localhost:9200',
				pathRewrite: {'^/search': ''}
			},
			'/iiif/vangogh': {
				changeOrigin: true,
				target: 'http://vangoghletters.org/vg/facsimiles',
				pathRewrite: {'^/iiif/vangogh': ''}
			},
			'/iiif/encyclopaedia-britannica': {
				changeOrigin: true,
				target: 'https://view.nls.uk/iiif',
				pathRewrite: {'^/iiif/encyclopaedia-britannica': ''}
			},
			'/iiif': {
				changeOrigin: true,
				target: baseConfig.plugins[0].definitions.DOCERE_IIIF_URL,
				pathRewrite: {'^/iiif': ''}
			},
			// '/xml': {
			// 	changeOrigin: true,
			// 	target: env.DOCERE_XML_URL,
			// },
		},
		watchOptions: {
			ignored: /node_modules/
		}
	}

	baseConfig.entry = ['./src/index.tsx']

	baseConfig.output = {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: __dirname + '/build-dev-server',
		publicPath: '/build-dev-server/',
	}

	return baseConfig
}
