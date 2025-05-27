// craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      // ─── ① まず .md を file-loader の対象から外す ───
      // CRA の file-loader ルール(oneOf)を探し、.md を除外します
      config.module.rules.forEach(rule => {
        if (!rule.oneOf)  return;
          rule.oneOf.forEach(loader => {
            if (
              loader.loader?.includes('file-loader') &&
              Array.isArray(loader.exclude)
            ) {
              loader.exclude.push(/\.md$/);
            }
          });
        });

      // ─── ② 先頭に raw-loader を挿入 ───
      // これで require.context すると純粋なテキストが返ってくるようになります
      config.module.rules.unshift({
        test: /\.md$/,
        use: [
          {
            loader: require.resolve('raw-loader'),
            options: { esModule: false }
          }
        ],
      });

      // ─── ③ js-yaml(Buffer) の polyfill ───
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
