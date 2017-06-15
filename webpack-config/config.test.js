let path = require('path');
let webpack = require('webpack');
module.exports = function (env) {
	return {
		entry: {
			test: './test/test.js'
		},
		output: {
			path: path.join(__dirname, '../test'),
			filename: '[name].build.js',
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