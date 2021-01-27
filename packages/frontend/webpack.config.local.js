const path = require('path')
const baseConfig = require('./webpack.config.base')

const { parsed: env, error: envError } = require('dotenv').config({ path: path.resolve(process.cwd(), `../../.env`) })
if (envError) throw envError

module.exports = () => {
	baseConfig.devServer = {
		contentBase: path.resolve(process.cwd(), '../../public'),
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
				target: env.DOCERE_IIIF_URL,
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
		filename: 'js/[fullhash].main.js',
		chunkFilename: 'js/[id].chunk.js',
		path: __dirname + '/build-dev-server',
		publicPath: '/',
	}

	return baseConfig
}
