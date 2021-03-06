
const merge = require('webpack-merge')
const baseConfig = require('./base.config.js')
const path = require('path')
const webpack = require('webpack')

module.exports = merge(baseConfig, {
        devtool: 'source-map',
        resolve: {
            alias: {
                'config': path.resolve(__dirname, '../config/dev.js')
            }
        },
        devServer: {
            inline: true,
            hot: true,
            contentBase: '../src',
            port: 9000,
            open: true,
            host: '0.0.0.0',
            stats: "errors-only"
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.ProvidePlugin({
                config: 'config'
            })
        ],
        module: {
            rules: [

            ]
        }
})

