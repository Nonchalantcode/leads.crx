const path = require('path')

module.exports = {
    watch: true,
    entry: path.resolve(__dirname, 'src', 'background', 'background.ts'),
    output: {
        path: path.resolve(__dirname, 'dist', 'background'),
        filename: 'background.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'   
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts'],
        modules: [path.resolve(__dirname, 'src', 'modules')],
    }
}