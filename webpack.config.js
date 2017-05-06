let path = require('path');
let webpack = require('webpack');
module.exports = function (env) {
	return {
		entry: {
			index: './index.ts'
		},
		output: {
			path: path.join(__dirname, '../dist'),
			filename: '[name].js',
			// publicPath: publicPath
		},
		plugins: [],
		module: {
			rules: [{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			}]
		},
		resolve: {
			extensions: [".ts", ".js"]
		},
	}
};