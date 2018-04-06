const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    plugins: [
        new UglifyJsPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new webpack.ProvidePlugin({
            'config': 'config'
        })
    ],
    resolve: {
        alias: {
            'config': path.resolve(__dirname, '../config/prod.js')
        }
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: ''
    },
    module: {
        rules: [

        ]
    }
})

