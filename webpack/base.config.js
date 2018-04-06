const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
        context: __dirname,
        node: {
            __filename: true
        },
        entry: '../src/app/index.ts',
        plugins: [
            new HtmlWebpackPlugin({
                inject: true,
                template: "../src/index.html"
            }),
            new webpack.ProvidePlugin({
                THREE: 'three'
            })
        ],
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader"
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                },
                {
                    test: /\.(ogg|mp3|jpe?g|png|gif|obj|svg|mpe?g|woff|ttf|eot|otf)$/i,
                    loader: 'file-loader',
                    exclude: /node_modules/
                },
                { test: /\.(glsl|vert|frag)$/, loader: 'raw-loader', exclude: /node_modules/ },
                { test: /\.(glsl|vert|frag)$/, loader: 'glslify-loader', exclude: /node_modules/ },
                {
                    test: /\.tsx|.ts?$/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader'
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: [
                        /node_modules/
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        }
}

