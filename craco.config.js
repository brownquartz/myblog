// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader',
      });
      return webpackConfig;
    },
  },
};
