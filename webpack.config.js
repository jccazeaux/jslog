var webpack = require('webpack');
var fs = require('fs');

var file = fs.readFileSync('./package.json', 'utf8');
var VERSION = JSON.parse(file).version;
var BANNER = 'jslog - ' + VERSION +
  ' https://github.com/jccazeaux/jslog\n' +
  ' Copyright (c) 2015 Jean-Christophe Cazeaux.\n' +
  ' Licensed under the MIT license.\n';

module.exports = {
  context: __dirname,
  entry: {
  	'jslog': './src/jslog',
  	'jslog.min': './src/jslog'
  },

  output: {
    path: './dist',
    filename: '[name].js',
    library: 'JSLog',
    libraryTarget: 'umd'
  },
  
  plugins: [
   new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new webpack.BannerPlugin(BANNER)
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      }
    ]
  },

  resolve: {
    extensions: ['', '.js']
  }
}
