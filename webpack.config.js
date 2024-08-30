const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => ({
    entry: path.resolve(__dirname, 'public/js/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    mode: argv.mode || 'development', // 'development' for dev, 'production' for optimized builds
    watch: argv.watch || false, // Enable watch mode only if '--watch' is passed
    devtool: argv.mode === 'production' ? false : 'source-map', // Disable source maps in production
    optimization: {
        minimize: argv.mode === 'production', // Minimize in production mode
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: true, // Compress output
                    mangle: true, // Mangle variable names
                    output: {
                        comments: false, // Remove comments
                    },
                },
                extractComments: false, // Do not extract comments into a separate file
            }),
        ],
    },
});
