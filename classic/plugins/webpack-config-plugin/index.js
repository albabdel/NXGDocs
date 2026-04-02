module.exports = function webpackConfigPlugin() {
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
      };
    },
  };
};
