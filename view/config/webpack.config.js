const path = require('path');

const config = {
    entry: './src/index.tsx',
    target: 'electron-renderer',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../../resources'),
        filename: 'app.bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader' }
        ]
    }
};

module.exports = config;