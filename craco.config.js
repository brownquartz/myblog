// craco.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // ─── ① file-loader から .md を除外 ───
      webpackConfig.module.rules.forEach(rule => {
        if (!rule.oneOf) return;
        rule.oneOf.forEach(loader => {
          if (
            loader.loader?.includes('file-loader') &&
            Array.isArray(loader.exclude)
          ) {
            // ←ここで .md を除外しておかないと raw-loader が動かない
            loader.exclude.push(/\.md$/);
          }
        });
      });

      // ─── ② raw-loader を追加 ───
      webpackConfig.module.rules.unshift({
        test: /\.md$/,
        include: path.resolve(__dirname, 'src/posts'),
        use: [
          {
            loader: require.resolve('raw-loader'),
            options: { esModule: false },
          }
        ],
      });

      // ─── ③ Buffer polyfill ───
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        buffer: require.resolve('buffer/'),
      };
      webpackConfig.plugins = [
        ...(webpackConfig.plugins || []),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer']
        }),
      ];

      return webpackConfig;
    },
  },
};
