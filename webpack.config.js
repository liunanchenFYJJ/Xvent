let path = require('path');
let webpack = require('webpack');
module.exports = function (env) {
	return {
		entry: {
			index: './index.js'
		},
		output: {
			path: path.join(__dirname, './dist'),
			filename: '[name].js',
			// publicPath: publicPath
		},
		plugins: [],
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['es2015']
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