const path = require('path')
const miniCSSExtract = require('mini-css-extract-plugin')


module.exports = {
    entry: {
        background_script: path.resolve(__dirname, 'src', 'background', 'background.ts'),
        content_script: path.resolve(__dirname, 'src', 'content', 'content.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [new miniCSSExtract({
        filename: '[name].css'
    })],
    module: {
        rules: [
            {
                test: /\.ts$/,
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
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src', 'modules'), path.resolve(__dirname, 'node_modules')],
    }
}