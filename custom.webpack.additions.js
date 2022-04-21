const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/main', to: '' },
            { from: 'src/universal', to: '' }
        ])
    ]
};
