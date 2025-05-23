// craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      // 1) Tell webpack what to do when it sees `require('buffer')`
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
      };
      // 2) Provide a global Buffer variable for code that expects it
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);
      return config;
    },
  },
};
