const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'public/js/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    mode: 'development', // Use 'production' for optimized builds
    watch: true, // Enable watch mode for development
    devtool: 'source-map', // Use 'source-map' instead of 'eval-source-map'
};
