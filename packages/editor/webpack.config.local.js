const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

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
		host: 'localhost',
		hot: true,
		// inline: true,
		port: 5000,
		proxy: {
			'/api': {
				target: `http://localhost:${env.DOCERE_API_PORT}`,
				// pathRewrite: {'^/api': ''}
			},
			'/search': {
				target: `http://localhost:${env.DOCERE_SEARCH_PORT}`,
				pathRewrite: {'^/search': ''}
			},
			'/iiif/vangogh': {
				changeOrigin: true,
				target: 'http://vangoghletters.org/vg/facsimiles',
				pathRewrite: {'^/iiif/vangogh': ''}
			},
			'/iiif': {
				changeOrigin: true,
				target: env.DOCERE_IIIF_BASE_URL,
				pathRewrite: {'^/iiif': ''}
			},
		},
		watchOptions: {
			ignored: /node_modules/,
			// poll: true
		}
	}

	baseConfig.entry = {
		app: './src/index.tsx',
		// 'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
		// 'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
		// 'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
		// 'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
		// 'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
	}

	baseConfig.output = {
		// globalObject: 'self',
		filename: '[name].bundle.js',
		chunkFilename: 'js/[id].chunk.js',
		path: __dirname + '/build-dev-server',
		publicPath: '/',
	}

	baseConfig.plugins.push(new HtmlWebpackPlugin({
		title: 'Docere',
		template: 'index.template.html',
	}))

	baseConfig.plugins.push(new MonacoWebpackPlugin({ languages: ['json', 'typescript'] }))

	return baseConfig
}
