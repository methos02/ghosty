const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let config = {
    mode: 'development',
    entry: "./resources/js/app.js",
    watch: true,
    output: {
        path: path.resolve(__dirname, "./public/js"),
        filename: "./app.js",
        publicPath: '/public'
    },
    module : {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: [
                "source-map-loader",
                {loader: 'babel-loader'}
            ]
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            })
        }, {
            test: /\.(svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    publicPath: './fonts/',
                    name: '../fonts/[name].[ext]',
                }
            }
        }, {
            test: /\.(png|jpeg|jpg)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '../images/[name].[ext]',
                    outputPath:'../images/',
                    publicPath: '../images/',
                }
            }
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $:'jquery',
            jQuery:'jquery',
        }),
        new ExtractTextPlugin({
            filename: "../css/styles.css"
        }),
    ],
    devtool: 'source-map'
};

module.exports = config;