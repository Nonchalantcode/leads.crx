const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const miniCSSExtract = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        // background_script: path.resolve(__dirname, 'src', 'background-script', 'background.ts'),
        content_script: path.resolve(__dirname, 'src', 'content-script', 'index.tsx')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'test'),
        port: 8000,
        writeToDisk: true
        // lazy: false,
        // index: 'index.html'
    },
    output: {
        path: path.resolve(__dirname, 'test'),
        filename: '[name].js'
    },
    plugins: [
        new miniCSSExtract({
            filename: '[name].css'
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'React Integration Mockup',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /(\.m?js$|\.tsx$)/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'   
                }
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /(node_modules|bower_components)/,
                use: [
                    miniCSSExtract.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [
            path.resolve(__dirname, 'src', 'background-script'),
            path.resolve(__dirname, 'src', 'content-script'),
            path.resolve(__dirname, 'src', 'modules'), 
            path.resolve(__dirname, 'node_modules')],
        alias: {
            Utils: path.resolve(__dirname, 'src', 'modules', 'utils.ts')
        }
    }
}