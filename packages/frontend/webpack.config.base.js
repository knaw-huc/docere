const path = require('path')
const webpack = require('webpack')

if (
	process.env.DOCERE_DTAP !== 'Development' &&
	process.env.DOCERE_DTAP !== 'Testing' && 
	process.env.DOCERE_DTAP !== 'Acceptance' && 
	process.env.DOCERE_DTAP !== 'Production'
) throw Error('DOCERE_DTAP environment variable is not set')

// Read the .env file
const { parsed: env, error: envError } = require('dotenv').config({ path: path.resolve(__dirname, `../../.env.${process.env.DOCERE_DTAP.toLowerCase()}`) })
if (envError) throw envError

module.exports = {
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
	plugins: [
		new webpack.DefinePlugin({
			...env,
			DOCERE_DTAP: JSON.stringify(process.env.DOCERE_DTAP),
		})
	],
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
	}
}
