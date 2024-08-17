const webpack = require('webpack');
const path = require("path");
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//     mode: "development",
//     entry: "./src/index.js",  // Adjusted to point to your entry file
//     output: {
//         path: path.resolve(__dirname, "public"),  // Output to the "dist" directory
//         filename: "bundle.js",  // Output filename as "bundle.js"
//         publicPath: '/'
//     },
//     target: "web",
//     devServer: {
//         port: "3000",  // Port for the dev server
//         static: {
//             directory: path.join(__dirname, 'public'),  // Serve files from "public" directory
//         },  // Serve files from the "dist" directory
//         open: true,  // Opens the browser after server starts
//         hot: true,   // Enable Hot Module Replacement
//         liveReload: true,  // Enable live reload
//         historyApiFallback: true,  // Handle client-side routing
//     },
//     resolve: {
//         extensions: ['.js', '.jsx', '.json']  // Resolving extensions
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 exclude: /node_modules/,
//                 use: 'babel-loader'  // Use Babel for JS and JSX files
//             },
//             {
//                 test: /\.css$/,  // Handling CSS files
//                 use: ['style-loader', 'css-loader']
//             },
//             {
//                 test: /\.(png|jpe?g|gif|svg)$/,  // Handling image files
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: '[path][name].[ext]',
//                         },
//                     },
//                 ],
//             },
//         ]
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: './src/index.html',
//             filename: 'index.html',
//         }),
//         new Dotenv()  // Loading environment variables from .env file
//     ]
// }



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