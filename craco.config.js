// craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      // １）Node の core モジュール buffer を npm の buffer で置き換える
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        buffer: require.resolve('buffer/'),
      };
      // ２）global Buffer を提供
      config.plugins = (config.plugins || []).concat(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
      return config;
    },
  },
};