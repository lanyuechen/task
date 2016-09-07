var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		bundle: ['./app.js']
	},
	output: {
		path: 'assets/',
		publicPath: 'asssets/',
		filename: '[name].js'
	},
	externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-bootstrap": "ReactBootstrap"
    },
	module: {
		loaders: [
			{
				test: /\.jsx?$/, 
				loader: 'babel',
				query: {
					presets: ['react', 'es2015']
				},
				exclude: /node_modules/
			},
			{
			    test: /\.css$/,
			    loaders: [
			    	'style?sourceMap',
			    	'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
			    ]
			},
			{
				test: /\.(jpg|png|gif)$/,
				loader: "url?limit=8192"
			}
		]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin('common.js'),
		new CopyWebpackPlugin([
			{from: 'node_modules/react/dist/react.min.js'},
			{from: 'node_modules/react-dom/dist/react-dom.min.js'},
			{from: 'node_modules/react-bootstrap/dist/react-bootstrap.min.js'}
		])
	]
}