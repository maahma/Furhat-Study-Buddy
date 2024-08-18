const webpack = require('webpack');
const path = require("path");
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./index.js",
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: '/',
        filename: "bundle.js",
    },
    target: "web",
    devServer: {
        port: "3000",
        static: {
            directory: path.join(__dirname, 'public'),
        },
        open: true,
        hot: true,
        liveReload: true,
        // historyApiFallback: true,
        historyApiFallback: {
            index: '/'
        }
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: false // Optional: set to true in production for minifying HTML
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
        }),
        new Dotenv()
    ]
};