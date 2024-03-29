const path = require('path')
const miniCSSExtract = require('mini-css-extract-plugin')

module.exports = {
    watch: true,
    entry: {
        content_script: path.resolve(__dirname, 'src', 'content-script', 'index.tsx')
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new miniCSSExtract({
            filename: '[name].css'
        }),
    ],
    module: {
        rules: [{
                test: /(\.m?js$|\.tsx$)/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-transform-runtime']
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
            path.resolve(__dirname, 'src', 'content-script'),
            path.resolve(__dirname, 'src', 'modules'),
            path.resolve(__dirname, 'node_modules')
        ],
        alias: {
            Utils: path.resolve(__dirname, 'src', 'modules', 'utils.ts')
        }
    }
}