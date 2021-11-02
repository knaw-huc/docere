const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')

const { parsed: env, error: envError } = require('dotenv').config({ path: path.resolve(process.cwd(), `../../.env`) })
if (envError) throw envError

module.exports = () => {
	baseConfig.devServer = {
		// contentBase: path.resolve(process.cwd(), '../../public'),
		static: [path.resolve(process.cwd(), '../../public')],
		// disableHostCheck: true,
		headers: { "Access-Control-Allow-Origin": "*" },
		historyApiFallback: {
			disableDotRule: true
		},
		host: 'localhost',
		hot: true,
		port: 4000,
		proxy: {
			'/api': {
				target: `http://localhost:${env.DOCERE_API_PORT}`,
				// pathRewrite: {'^/api': ''}
			},
			'/search': {
				target: `http://localhost:${env.DOCERE_SEARCH_PORT}`,
				pathRewrite: {'^/search': ''}
			},
			// '/iiif/vangogh': {
			// 	changeOrigin: true,
			// 	target: 'http://vangoghletters.org/vg/facsimiles',
			// 	pathRewrite: {'^/iiif/vangogh': ''}
			// },
			'/iiif': {
				changeOrigin: true,
				target: env.DOCERE_IIIF_BASE_URL,
				pathRewrite: {'^/iiif': ''}
			},
		},
	}

	baseConfig.watchOptions = {
		ignored: /node_modules/
	}

	baseConfig.entry = ['./src/index.tsx']

	baseConfig.output = {
		filename: 'js/[fullhash].main.js',
		chunkFilename: 'js/[id].chunk.js',
		path: __dirname + '/build-dev-server',
		publicPath: '/',
	}

	baseConfig.plugins.push(new HtmlWebpackPlugin({
		title: 'Docere',
		template: 'index.template.html',
	}))

	return baseConfig
}
