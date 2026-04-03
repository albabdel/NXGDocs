const webpack = require('webpack');

module.exports = function webpackConfigPlugin() {
  const product = process.env.PRODUCT || 'gcxone';

  return {
    name: 'webpack-config-plugin',
    configureWebpack(config, isServer) {
      if (isServer) {
        return {};
      }
      return {
        optimization: {
          minimize: false,
        },
        plugins: [
          new webpack.DefinePlugin({
            'process.env.PRODUCT': JSON.stringify(product),
          }),
        ],
      };
    },
  };
};
