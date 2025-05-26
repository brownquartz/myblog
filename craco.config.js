// craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      // 1) .md を文字列として読み込む
      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader',
      });
      // 2) js-yaml(buffer) ポリフィル
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        buffer: require.resolve('buffer/'),
      };
      config.plugins = [
        ...(config.plugins || []),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ];
      return config;
    },
  },
};
