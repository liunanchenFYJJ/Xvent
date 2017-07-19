let path = require('path');
let webpack = require('webpack');
module.exports = function (env) {
	return {
		entry: {
			index: './test/test.js',
			vendor: ['rxjs-es'],
		},
		devtool: 'inline-source-map',
		output: {
			path: path.join(__dirname, '../test'),
			filename: '[name].js',
		},
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				name: ['vendor', 'manifest']
			})
		],
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['env']
						}
					}
				},
			]
		},
		resolve: {
			extensions: [".js"]
		},
	}
};