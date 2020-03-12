
module.exports = {
	entry: ['./src/index.ts'],
	output: {
		publicPath: '/projects/',
		filename: 'index.js',
		path: __dirname + '/dist',

		globalObject: 'this',
		library: "DocereProjects",
		libraryTarget: "umd",

	},
	mode: 'development',
	module: {
		rules: [
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					options: {
						configFile: 'tsconfig.dist.json',
						transpileOnly: true
					}
				}
		]
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
	},
};
